import { Prisma } from '@prisma/client';
import { z } from 'zod';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;

// DECIMAL
//------------------------------------------------------

export const DecimalJsLikeSchema: z.ZodType<Prisma.DecimalJsLike> = z.object({
  d: z.array(z.number()),
  e: z.number(),
  s: z.number(),
  toFixed: z.function(z.tuple([]), z.string()),
})

export const DECIMAL_STRING_REGEX = /^(?:-?Infinity|NaN|-?(?:0[bB][01]+(?:\.[01]+)?(?:[pP][-+]?\d+)?|0[oO][0-7]+(?:\.[0-7]+)?(?:[pP][-+]?\d+)?|0[xX][\da-fA-F]+(?:\.[\da-fA-F]+)?(?:[pP][-+]?\d+)?|(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?))$/;

export const isValidDecimalInput =
  (v?: null | string | number | Prisma.DecimalJsLike): v is string | number | Prisma.DecimalJsLike => {
    if (v === undefined || v === null) return false;
    return (
      (typeof v === 'object' && 'd' in v && 'e' in v && 's' in v && 'toFixed' in v) ||
      (typeof v === 'string' && DECIMAL_STRING_REGEX.test(v)) ||
      typeof v === 'number'
    )
  };

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const CompanyScalarFieldEnumSchema = z.enum(['id','name','ticker','exchange','sector','industry','description','website','createdAt','updatedAt']);

export const IPOScalarFieldEnumSchema = z.enum(['id','companyId','filingDate','expectedDate','actualDate','status','sharesOffered','priceRangeLow','priceRangeHigh','actualPrice','marketCap','secFilingId','createdAt','updatedAt']);

export const SECFilingScalarFieldEnumSchema = z.enum(['id','companyId','accessionNumber','filingType','filingDate','reportDate','documentUrl','htmlUrl','documentTitle','documentSize','parsedData','createdAt','updatedAt']);

export const SocialMentionScalarFieldEnumSchema = z.enum(['id','companyId','ipoId','platform','postId','author','content','url','likes','shares','comments','views','sentiment','sentimentScore','postedAt','createdAt','updatedAt']);

export const UserScalarFieldEnumSchema = z.enum(['id','clerkId','email','firstName','lastName','createdAt','updatedAt']);

export const UserWatchlistScalarFieldEnumSchema = z.enum(['id','userId','ipoId','alertsEnabled','notes','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const IPOStatusSchema = z.enum(['FILED','PRICED','WITHDRAWN','POSTPONED','COMPLETED']);

export type IPOStatusType = `${z.infer<typeof IPOStatusSchema>}`

export const SocialPlatformSchema = z.enum(['TWITTER','REDDIT','LINKEDIN','YOUTUBE']);

export type SocialPlatformType = `${z.infer<typeof SocialPlatformSchema>}`

export const SentimentTypeSchema = z.enum(['POSITIVE','NEGATIVE','NEUTRAL']);

export type SentimentTypeType = `${z.infer<typeof SentimentTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// COMPANY SCHEMA
/////////////////////////////////////////

export const CompanySchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  ticker: z.string().nullable(),
  exchange: z.string().nullable(),
  sector: z.string().nullable(),
  industry: z.string().nullable(),
  description: z.string().nullable(),
  website: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Company = z.infer<typeof CompanySchema>

/////////////////////////////////////////
// IPO SCHEMA
/////////////////////////////////////////

export const IPOSchema = z.object({
  status: IPOStatusSchema,
  id: z.string().cuid(),
  companyId: z.string(),
  filingDate: z.coerce.date().nullable(),
  expectedDate: z.coerce.date().nullable(),
  actualDate: z.coerce.date().nullable(),
  sharesOffered: z.bigint().nullable(),
  priceRangeLow: z.instanceof(Prisma.Decimal, { message: "Field 'priceRangeLow' must be a Decimal. Location: ['Models', 'IPO']"}).nullable(),
  priceRangeHigh: z.instanceof(Prisma.Decimal, { message: "Field 'priceRangeHigh' must be a Decimal. Location: ['Models', 'IPO']"}).nullable(),
  actualPrice: z.instanceof(Prisma.Decimal, { message: "Field 'actualPrice' must be a Decimal. Location: ['Models', 'IPO']"}).nullable(),
  marketCap: z.bigint().nullable(),
  secFilingId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type IPO = z.infer<typeof IPOSchema>

/////////////////////////////////////////
// SEC FILING SCHEMA
/////////////////////////////////////////

export const SECFilingSchema = z.object({
  id: z.string().cuid(),
  companyId: z.string(),
  accessionNumber: z.string(),
  filingType: z.string(),
  filingDate: z.coerce.date(),
  reportDate: z.coerce.date().nullable(),
  documentUrl: z.string(),
  htmlUrl: z.string().nullable(),
  documentTitle: z.string().nullable(),
  documentSize: z.number().int().nullable(),
  parsedData: JsonValueSchema.nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type SECFiling = z.infer<typeof SECFilingSchema>

/////////////////////////////////////////
// SOCIAL MENTION SCHEMA
/////////////////////////////////////////

export const SocialMentionSchema = z.object({
  platform: SocialPlatformSchema,
  sentiment: SentimentTypeSchema.nullable(),
  id: z.string().cuid(),
  companyId: z.string().nullable(),
  ipoId: z.string().nullable(),
  postId: z.string(),
  author: z.string(),
  content: z.string(),
  url: z.string(),
  likes: z.number().int(),
  shares: z.number().int(),
  comments: z.number().int(),
  views: z.number().int(),
  sentimentScore: z.instanceof(Prisma.Decimal, { message: "Field 'sentimentScore' must be a Decimal. Location: ['Models', 'SocialMention']"}).nullable(),
  postedAt: z.coerce.date(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type SocialMention = z.infer<typeof SocialMentionSchema>

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  clerkId: z.string(),
  email: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// USER WATCHLIST SCHEMA
/////////////////////////////////////////

export const UserWatchlistSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  ipoId: z.string(),
  alertsEnabled: z.boolean(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type UserWatchlist = z.infer<typeof UserWatchlistSchema>
