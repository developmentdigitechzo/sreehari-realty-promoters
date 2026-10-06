import { Request, Response, NextFunction } from 'express';
import { db } from '../config/db.js';
import { sendSuccess } from '../utils/response.js';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const [
      totalProjectsRes,
      activeProjectsRes,
      totalPlotsRes,
      availablePlotsRes,
      totalLeadsRes,
      newLeadsRes,
      recentLeadsRes,
      leadsByStatusRes,
    ] = await Promise.all([
      db.query(`SELECT COUNT(*) FROM projects`),
      db.query(`SELECT COUNT(*) FROM projects WHERE status = 'ONGOING' AND is_visible = TRUE`),
      db.query(`SELECT COUNT(*) FROM properties`),
      db.query(`SELECT COUNT(*) FROM properties WHERE status = 'AVAILABLE' AND is_visible = TRUE`),
      db.query(`SELECT COUNT(*) FROM leads`),
      db.query(`SELECT COUNT(*) FROM leads WHERE status = 'NEW'`),
      db.query(`
        SELECT l.*, p.name as project_name 
        FROM leads l 
        LEFT JOIN projects p ON p.id = l.project_id 
        ORDER BY l.created_at DESC 
        LIMIT 6
      `),
      db.query(`
        SELECT status, COUNT(*) as count 
        FROM leads 
        GROUP BY status
      `),
    ]);

    return sendSuccess(res, 'Dashboard statistics fetched successfully', {
      totalProjects: parseInt(totalProjectsRes.rows[0].count, 10),
      activeProjects: parseInt(activeProjectsRes.rows[0].count, 10),
      totalProperties: parseInt(totalPlotsRes.rows[0].count, 10),
      availableProperties: parseInt(availablePlotsRes.rows[0].count, 10),
      totalLeads: parseInt(totalLeadsRes.rows[0].count, 10),
      newLeads: parseInt(newLeadsRes.rows[0].count, 10),
      recentLeads: recentLeadsRes.rows,
      leadsByStatus: leadsByStatusRes.rows,
    });
  } catch (error) {
    next(error);
  }
};
