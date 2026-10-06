import { Request, Response, NextFunction } from 'express';
import { db, memoryStore } from '../config/db.js';
import { sendSuccess } from '../utils/response.js';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (db.isPostgres()) {
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
    }

    // In-memory fallback
    const totalProjects = memoryStore.projects.length;
    const activeProjects = memoryStore.projects.filter((p) => p.status === 'ONGOING' && p.is_visible).length;
    const totalProperties = memoryStore.properties.length;
    const availableProperties = memoryStore.properties.filter((p) => p.status === 'AVAILABLE' && p.is_visible).length;
    const totalLeads = memoryStore.leads.length;
    const newLeads = memoryStore.leads.filter((l) => l.status === 'NEW').length;

    const recentLeads = memoryStore.leads.slice(0, 6).map((lead) => {
      const proj = memoryStore.projects.find((p) => p.id === lead.project_id);
      return {
        ...lead,
        project_name: proj?.name,
      };
    });

    return sendSuccess(res, 'Dashboard statistics fetched successfully', {
      totalProjects,
      activeProjects,
      totalProperties,
      availableProperties,
      totalLeads,
      newLeads,
      recentLeads,
      leadsByStatus: [
        { status: 'NEW', count: newLeads.toString() },
        { status: 'CONTACTED', count: memoryStore.leads.filter((l) => l.status === 'CONTACTED').length.toString() },
      ],
    });
  } catch (error) {
    next(error);
  }
};
