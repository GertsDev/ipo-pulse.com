import { z } from 'zod';

// Base schemas for common data types
export const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const DecimalStringSchema = z.string().regex(/^\d+(\.\d{1,2})?$/);

// SEC API Response Schemas
export const SECFilingSchema = z.object({
  accessionNumber: z.string(),
  filingType: z.string(),
  filingDate: z.string(),
  reportDate: z.string().optional(),
  companyName: z.string(),
  ticker: z.string().optional(),
  cik: z.string(),
  documentUrl: z.string().url(),
  htmlUrl: z.string().url().optional(),
  documentTitle: z.string().optional(),
  documentSize: z.number().optional(),
});

export const IPOCalendarSchema = z.object({
  data: z.array(
    z.object({
      company: z.string(),
      ticker: z.string().optional(),
      exchange: z.string().optional(),
      sector: z.string().optional(),
      industry: z.string().optional(),
      filingDate: z.string(),
      expectedDate: z.string().optional(),
      sharesOffered: z.string().optional(),
      priceRangeLow: DecimalStringSchema.optional(),
      priceRangeHigh: DecimalStringSchema.optional(),
      marketCap: z.string().optional(),
      description: z.string().optional(),
      website: z.string().url().optional(),
    })
  ),
});

// Social Media API Schemas
export const TwitterMentionSchema = z.object({
  id: z.string(),
  text: z.string(),
  author_id: z.string(),
  created_at: z.string(),
  public_metrics: z.object({
    retweet_count: z.number(),
    like_count: z.number(),
    reply_count: z.number(),
    quote_count: z.number(),
  }),
  entities: z
    .object({
      hashtags: z
        .array(
          z.object({
            tag: z.string(),
          })
        )
        .optional(),
      mentions: z
        .array(
          z.object({
            username: z.string(),
          })
        )
        .optional(),
    })
    .optional(),
});

export const RedditMentionSchema = z.object({
  id: z.string(),
  title: z.string(),
  selftext: z.string(),
  author: z.string(),
  created_utc: z.number(),
  score: z.number(),
  num_comments: z.number(),
  ups: z.number(),
  downs: z.number(),
  url: z.string().url(),
  subreddit: z.string(),
});

// Database Input Schemas
export const CreateCompanySchema = z.object({
  name: z.string().min(1, 'Company name is required'),
  ticker: z.string().optional(),
  exchange: z.string().optional(),
  sector: z.string().optional(),
  industry: z.string().optional(),
  description: z.string().optional(),
  website: z.string().url().optional(),
});

export const CreateIPOSchema = z.object({
  companyId: z.string().cuid(),
  filingDate: z.date().optional(),
  expectedDate: z.date().optional(),
  actualDate: z.date().optional(),
  status: z
    .enum(['FILED', 'PRICED', 'WITHDRAWN', 'POSTPONED', 'COMPLETED'])
    .default('FILED'),
  sharesOffered: z.bigint().optional(),
  priceRangeLow: z.number().positive().optional(),
  priceRangeHigh: z.number().positive().optional(),
  actualPrice: z.number().positive().optional(),
  marketCap: z.bigint().optional(),
  secFilingId: z.string().cuid().optional(),
});

export const CreateSECFilingSchema = z.object({
  companyId: z.string().cuid(),
  accessionNumber: z.string(),
  filingType: z.string(),
  filingDate: z.date(),
  reportDate: z.date().optional(),
  documentUrl: z.string().url(),
  htmlUrl: z.string().url().optional(),
  documentTitle: z.string().optional(),
  documentSize: z.number().optional(),
  parsedData: z.record(z.any()).optional(),
});

export const CreateSocialMentionSchema = z.object({
  companyId: z.string().cuid().optional(),
  ipoId: z.string().cuid().optional(),
  platform: z.enum(['TWITTER', 'REDDIT', 'LINKEDIN', 'YOUTUBE']),
  postId: z.string(),
  author: z.string(),
  content: z.string(),
  url: z.string().url(),
  likes: z.number().nonnegative().default(0),
  shares: z.number().nonnegative().default(0),
  comments: z.number().nonnegative().default(0),
  views: z.number().nonnegative().default(0),
  sentiment: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).optional(),
  sentimentScore: z.number().min(-1).max(1).optional(),
  postedAt: z.date(),
});

// User Input Schemas
export const AddToWatchlistSchema = z.object({
  ipoId: z.string().cuid(),
  alertsEnabled: z.boolean().default(true),
  notes: z.string().optional(),
});

export const UpdateWatchlistSchema = z.object({
  id: z.string().cuid(),
  alertsEnabled: z.boolean().optional(),
  notes: z.string().optional(),
});

// Query Schemas
export const IPOQuerySchema = z.object({
  status: z
    .enum(['FILED', 'PRICED', 'WITHDRAWN', 'POSTPONED', 'COMPLETED'])
    .optional(),
  sector: z.string().optional(),
  industry: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(100).default(20),
  offset: z.number().nonnegative().default(0),
});

export const SocialMentionQuerySchema = z.object({
  companyId: z.string().cuid().optional(),
  ipoId: z.string().cuid().optional(),
  platform: z.enum(['TWITTER', 'REDDIT', 'LINKEDIN', 'YOUTUBE']).optional(),
  sentiment: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().nonnegative().default(0),
});

// Type exports for use throughout the app
export type SECFiling = z.infer<typeof SECFilingSchema>;
export type IPOCalendarData = z.infer<typeof IPOCalendarSchema>;
export type TwitterMention = z.infer<typeof TwitterMentionSchema>;
export type RedditMention = z.infer<typeof RedditMentionSchema>;
export type CreateCompanyInput = z.infer<typeof CreateCompanySchema>;
export type CreateIPOInput = z.infer<typeof CreateIPOSchema>;
export type CreateSECFilingInput = z.infer<typeof CreateSECFilingSchema>;
export type CreateSocialMentionInput = z.infer<
  typeof CreateSocialMentionSchema
>;
export type AddToWatchlistInput = z.infer<typeof AddToWatchlistSchema>;
export type UpdateWatchlistInput = z.infer<typeof UpdateWatchlistSchema>;
export type IPOQuery = z.infer<typeof IPOQuerySchema>;
export type SocialMentionQuery = z.infer<typeof SocialMentionQuerySchema>;
