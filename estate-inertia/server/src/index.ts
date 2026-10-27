import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const app = express();
const prisma = new PrismaClient();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.warn('WARNING: set JWT_SECRET to a random value at least 32 characters long in server/.env');
}
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));

type AuthRequest = Request & { user?: { id: string; companyId: string; email: string } };
function auth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token || !JWT_SECRET || JWT_SECRET.length < 32) return res.status(401).json({ error: 'Authentication required.' });
  try { req.user = jwt.verify(token, JWT_SECRET) as { id: string; companyId: string; email: string }; next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired token.' }); }
}
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'estate-inertia-api' }));

const registerSchema = z.object({ name: z.string().trim().min(2).max(100), companyName: z.string().trim().min(2).max(120), email: z.string().trim().email().max(254), password: z.string().min(10).max(128), phone: z.string().trim().min(8).max(20).optional() });
app.post('/api/auth/register', async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Please check the registration details.', details: parsed.error.flatten() });
  const { name, companyName, email, password, phone } = parsed.data;
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { name, email: email.toLowerCase(), phone, passwordHash, company: { create: { name: companyName } } }, include: { company: true } });
    if (!JWT_SECRET || JWT_SECRET.length < 32) return res.status(500).json({ error: 'Server authentication is not configured.' });
    const token = jwt.sign({ id: user.id, companyId: user.companyId, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
    return res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email, companyId: user.companyId, companyName: user.company.name, phoneVerified: false } });
  } catch (error: any) {
    if (error?.code === 'P2002') return res.status(409).json({ error: 'An account with this email already exists.' });
    console.error(error); return res.status(500).json({ error: 'Could not create account.' });
  }
});
const loginSchema = z.object({ email: z.string().trim().email(), password: z.string().min(1).max(128) });
app.post('/api/auth/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Enter a valid email and password.' });
  const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() }, include: { company: true } });
  if (!user || !(await bcrypt.compare(parsed.data.password, user.passwordHash))) return res.status(401).json({ error: 'Email or password is incorrect.' });
  if (!JWT_SECRET || JWT_SECRET.length < 32) return res.status(500).json({ error: 'Server authentication is not configured.' });
  const token = jwt.sign({ id: user.id, companyId: user.companyId, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
  return res.json({ token, user: { id: user.id, name: user.name, email: user.email, companyId: user.companyId, companyName: user.company.name, phoneVerified: Boolean(user.phoneVerifiedAt) } });
});
app.get('/api/auth/me', auth, async (req: AuthRequest, res) => {
  const user = await prisma.user.findFirst({ where: { id: req.user!.id, companyId: req.user!.companyId }, select: { id: true, name: true, email: true, phone: true, phoneVerifiedAt: true, companyId: true, company: { select: { name: true } } } });
  if (!user) return res.status(404).json({ error: 'Account not found.' });
  return res.json({ user: { id: user.id, name: user.name, email: user.email, phone: user.phone, phoneVerified: Boolean(user.phoneVerifiedAt), companyId: user.companyId, companyName: user.company.name } });
});
app.get('/api/properties', auth, async (req: AuthRequest, res) => {
  const properties = await prisma.property.findMany({ where: { companyId: req.user!.companyId }, include: { project: { select: { id: true, name: true, location: true } } }, orderBy: { updatedAt: 'desc' }, take: 200 });
  return res.json({ properties });
});
const propertySchema = z.object({ code: z.string().trim().min(1).max(40), title: z.string().trim().min(2).max(180), type: z.enum(['LAND','PLOT','APARTMENT','VILLA','INDEPENDENT_HOUSE','COMMERCIAL']), status: z.enum(['AVAILABLE','RESERVED','SOLD','ON_HOLD','UNVERIFIED']).optional(), location: z.string().trim().min(2).max(240), areaValue: z.number().positive().optional(), areaUnit: z.string().max(30).optional(), price: z.number().nonnegative().optional(), description: z.string().max(5000).optional(), projectId: z.string().optional() });
app.post('/api/properties', auth, async (req: AuthRequest, res) => {
  const parsed = propertySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Please check the property details.', details: parsed.error.flatten() });
  const d = parsed.data;
  try {
    if (d.projectId) { const project = await prisma.project.findFirst({ where: { id: d.projectId, companyId: req.user!.companyId } }); if (!project) return res.status(400).json({ error: 'Project not found in this company.' }); }
    const property = await prisma.property.create({ data: { companyId: req.user!.companyId, code: d.code, title: d.title, type: d.type, status: d.status ?? 'UNVERIFIED', location: d.location, areaValue: d.areaValue, areaUnit: d.areaUnit ?? 'sq.ft', price: d.price, description: d.description, projectId: d.projectId } });
    return res.status(201).json({ property });
  } catch (error: any) { if (error?.code === 'P2002') return res.status(409).json({ error: 'This property code already exists for your company.' }); console.error(error); return res.status(500).json({ error: 'Could not save property.' }); }
});
app.get('/api/leads', auth, async (req: AuthRequest, res) => {
  const leads = await prisma.lead.findMany({ where: { companyId: req.user!.companyId }, orderBy: { updatedAt: 'desc' }, take: 200 });
  return res.json({ leads });
});
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => { console.error(err); res.status(500).json({ error: 'Unexpected server error.' }); });
app.listen(PORT, () => console.log(`Estate Inertia API listening on http://localhost:${PORT}`));
