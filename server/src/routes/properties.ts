import { Router } from "express";
import { z } from "zod";
import { pool } from "../db.js";
export const propertiesRouter=Router();
const schema=z.object({
 name:z.string().trim().min(1).max(180),
 property_type:z.enum(["land","plot","apartment","flat","villa","independent_house","commercial","other"]),
 status:z.enum(["available","reserved","sold","rented","inactive"]).optional(),
 price:z.coerce.number().min(0),currency:z.string().trim().length(3).default("INR"),
 location:z.string().trim().min(1).max(1000),
 area_sqft:z.coerce.number().min(0).nullable().optional(),
 bedrooms:z.coerce.number().int().min(0).nullable().optional(),
 bathrooms:z.coerce.number().int().min(0).nullable().optional(),
 description:z.string().max(10000).nullable().optional(),
 owner_name:z.string().trim().max(180).nullable().optional(),
 owner_phone:z.string().trim().max(40).nullable().optional()
});
const allowed=["name","property_type","status","price","currency","location","area_sqft","bedrooms","bathrooms","description","owner_name","owner_phone"];
propertiesRouter.get("/",async(req,res,next)=>{try{
 const page=Math.max(1,parseInt(String(req.query.page??"1"))||1),limit=Math.min(100,Math.max(1,parseInt(String(req.query.limit??"20"))||20));
 const where:string[]=[],values:unknown[]=[];
 const search=String(req.query.search??"").trim(),status=String(req.query.status??"").trim(),type=String(req.query.property_type??"").trim();
 if(search){values.push(`%${search}%`);where.push(`(name ILIKE $${values.length} OR location ILIKE $${values.length} OR COALESCE(description,'') ILIKE $${values.length})`);}
 if(status){values.push(status);where.push(`status=$${values.length}`);}
 if(type){values.push(type);where.push(`property_type=$${values.length}`);}
 const clause=where.length?`WHERE ${where.join(" AND ")}`:"";
 const count=await pool.query(`SELECT COUNT(*)::int AS total FROM properties ${clause}`,values);
 values.push(limit,(page-1)*limit);
 const result=await pool.query(`SELECT * FROM properties ${clause} ORDER BY created_at DESC LIMIT $${values.length-1} OFFSET $${values.length}`,values);
 res.json({data:result.rows,pagination:{page,limit,total:count.rows[0].total,pages:Math.ceil(count.rows[0].total/limit)}});
}catch(e){next(e)}});
propertiesRouter.get("/:id",async(req,res,next)=>{try{const r=await pool.query("SELECT * FROM properties WHERE id=$1",[req.params.id]);if(!r.rowCount)return res.status(404).json({error:"Property not found"});res.json({data:r.rows[0]});}catch(e){next(e)}});
propertiesRouter.post("/",async(req,res,next)=>{try{const parsed=schema.safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Validation failed",details:parsed.error.flatten()});const p={status:"available",...parsed.data};const cols=allowed.filter(k=>p[k as keyof typeof p]!==undefined);const vals=cols.map(k=>p[k as keyof typeof p]??null);const ph=cols.map((_,i)=>`$${i+1}`);const r=await pool.query(`INSERT INTO properties (${cols.join(",")}) VALUES (${ph.join(",")}) RETURNING *`,vals);res.status(201).json({data:r.rows[0]});}catch(e){next(e)}});
propertiesRouter.patch("/:id",async(req,res,next)=>{try{const parsed=schema.partial().safeParse(req.body);if(!parsed.success)return res.status(400).json({error:"Validation failed",details:parsed.error.flatten()});const entries=Object.entries(parsed.data);if(!entries.length)return res.status(400).json({error:"Provide fields to update"});const vals=entries.map(([,v])=>v??null);vals.push(req.params.id);const sets=entries.map(([k],i)=>`${k}=$${i+1}`);const r=await pool.query(`UPDATE properties SET ${sets.join(",")},updated_at=NOW() WHERE id=$${vals.length} RETURNING *`,vals);if(!r.rowCount)return res.status(404).json({error:"Property not found"});res.json({data:r.rows[0]});}catch(e){next(e)}});
propertiesRouter.delete("/:id",async(req,res,next)=>{try{const r=await pool.query("DELETE FROM properties WHERE id=$1 RETURNING id",[req.params.id]);if(!r.rowCount)return res.status(404).json({error:"Property not found"});res.status(204).send();}catch(e){next(e)}});