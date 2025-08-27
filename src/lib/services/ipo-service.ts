import { db } from '@/lib/db';
import { IPOSchema } from '@/lib/zod';
import type { IPOStatus } from '@prisma/client';
import { cache } from 'react';
import { z } from 'zod';

// Extended schema for IPO with company data
const IPOWithCompanySchema = IPOSchema.extend({
  company: z.object({
    name: z.string(),
    ticker: z.string().nullable(),
    sector: z.string().nullable(),
    industry: z.string().nullable(),
  }),
});

export type IPOWithCompany = z.infer<typeof IPOWithCompanySchema>;

// Query options interface
interface GetIPOsOptions {
  limit?: number;
  status?: IPOStatus[];
  includeCompanyDetails?: boolean;
  orderBy?: 'expectedDate' | 'filingDate' | 'actualDate';
  orderDirection?: 'asc' | 'desc';
}

/**
 * Cached function to fetch upcoming IPOs with company information
 * Uses React cache for request deduplication
 */
export const getUpcomingIPOs = cache(
  async (options: GetIPOsOptions = {}): Promise<IPOWithCompany[]> => {
    const {
      limit = 10,
      status = ['FILED', 'PRICED'],
      includeCompanyDetails = true,
      orderBy = 'expectedDate',
      orderDirection = 'asc',
    } = options;

    try {
      const ipos = await db.iPO.findMany({
        where: {
          status: {
            in: status,
          },
          // Only show IPOs with future expected dates or no date set
          OR: [{ expectedDate: { gte: new Date() } }, { expectedDate: null }],
        },
        include: {
          company: {
            select: {
              name: true,
              ticker: true,
              ...(includeCompanyDetails && {
                sector: true,
                industry: true,
              }),
            },
          },
        },
        orderBy: {
          [orderBy]: orderDirection,
        },
        take: limit,
      });

      // Validate the data with Zod
      return z.array(IPOWithCompanySchema).parse(ipos);
    } catch (error) {
      console.error('Failed to fetch upcoming IPOs:', error);
      throw new Error('Unable to load IPO data');
    }
  }
);

/**
 * Get IPO by ID with full company details
 */
export const getIPOById = cache(
  async (id: string): Promise<IPOWithCompany | null> => {
    try {
      const ipo = await db.iPO.findUnique({
        where: { id },
        include: {
          company: {
            select: {
              name: true,
              ticker: true,
              sector: true,
              industry: true,
              description: true,
              website: true,
            },
          },
          secFiling: {
            select: {
              accessionNumber: true,
              filingType: true,
              filingDate: true,
              documentUrl: true,
            },
          },
        },
      });

      if (!ipo) return null;

      // Validate with extended schema
      const ExtendedIPOSchema = IPOWithCompanySchema.extend({
        company: IPOWithCompanySchema.shape.company.extend({
          description: z.string().nullable(),
          website: z.string().nullable(),
        }),
        secFiling: z
          .object({
            accessionNumber: z.string(),
            filingType: z.string(),
            filingDate: z.date(),
            documentUrl: z.string(),
          })
          .nullable(),
      });

      return ExtendedIPOSchema.parse(ipo);
    } catch (error) {
      console.error(`Failed to fetch IPO with ID ${id}:`, error);
      throw new Error('Unable to load IPO details');
    }
  }
);

/**
 * Get IPO statistics
 */
export const getIPOStats = cache(async () => {
  try {
    const [totalFiled, totalPriced, totalCompleted] = await Promise.all([
      db.iPO.count({ where: { status: 'FILED' } }),
      db.iPO.count({ where: { status: 'PRICED' } }),
      db.iPO.count({ where: { status: 'COMPLETED' } }),
    ]);

    return {
      totalFiled,
      totalPriced,
      totalCompleted,
      total: totalFiled + totalPriced + totalCompleted,
    };
  } catch (error) {
    console.error('Failed to fetch IPO statistics:', error);
    throw new Error('Unable to load IPO statistics');
  }
});

/**
 * Search IPOs by company name or ticker
 */
export const searchIPOs = cache(
  async (query: string, limit = 10): Promise<IPOWithCompany[]> => {
    if (!query.trim()) return [];

    try {
      const ipos = await db.iPO.findMany({
        where: {
          company: {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { ticker: { contains: query, mode: 'insensitive' } },
            ],
          },
        },
        include: {
          company: {
            select: {
              name: true,
              ticker: true,
              sector: true,
              industry: true,
            },
          },
        },
        orderBy: {
          expectedDate: 'asc',
        },
        take: limit,
      });

      return z.array(IPOWithCompanySchema).parse(ipos);
    } catch (error) {
      console.error(`Failed to search IPOs with query "${query}":`, error);
      throw new Error('Unable to search IPO data');
    }
  }
);
