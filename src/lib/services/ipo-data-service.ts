// import { db } from '@/lib/db';
// import {
//   CreateSocialMentionInput,
//   IPOCalendarSchema,
//   IPOQuery,
//   SECFilingSchema,
//   TwitterMentionSchema,
//   type IPOCalendarData,
//   type RedditMention,
//   type SECFiling,
//   type TwitterMention,
// } from '@/lib/validations/ipo-schemas';
// import { revalidateTag } from 'next/cache';

// /**
//  * Type-safe IPO Data Service
//  * Handles fetching from external APIs and storing in database
//  */
// export class IPODataService {
//   private static instance: IPODataService;
//   private readonly SEC_API_BASE = 'https://api.sec-api.io';
//   private readonly TWITTER_API_BASE = 'https://api.twitter.com/2';
//   private readonly REDDIT_API_BASE = 'https://oauth.reddit.com';

//   private constructor() {}

//   static getInstance(): IPODataService {
//     if (!IPODataService.instance) {
//       IPODataService.instance = new IPODataService();
//     }
//     return IPODataService.instance;
//   }

//   /**
//    * Fetch IPO Calendar from SEC API with validation
//    */
//   async fetchIPOCalendar(
//     startDate?: Date,
//     endDate?: Date
//   ): Promise<IPOCalendarData> {
//     try {
//       const params = new URLSearchParams();
//       if (startDate)
//         params.append('startDate', startDate.toISOString().split('T')[0]);
//       if (endDate)
//         params.append('endDate', endDate.toISOString().split('T')[0]);

//       const response = await fetch(
//         `${this.SEC_API_BASE}/ipo-calendar?${params}`,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.SEC_API_KEY}`,
//             'Content-Type': 'application/json',
//           },
//           next: {
//             revalidate: 3600, // Cache for 1 hour
//             tags: ['ipo-calendar'],
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`SEC API error: ${response.status}`);
//       }

//       const rawData = await response.json();

//       // Validate with Zod schema
//       const validatedData = IPOCalendarSchema.parse(rawData);

//       return validatedData;
//     } catch (error) {
//       console.error('Failed to fetch IPO calendar:', error);
//       throw new Error('Failed to fetch IPO calendar data');
//     }
//   }

//   /**
//    * Fetch SEC Filing with validation
//    */
//   async fetchSECFiling(accessionNumber: string): Promise<SECFiling> {
//     try {
//       const response = await fetch(
//         `${this.SEC_API_BASE}/filing/${accessionNumber}`,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.SEC_API_KEY}`,
//           },
//           next: {
//             revalidate: 86400, // Cache for 24 hours
//             tags: ['sec-filing', accessionNumber],
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`SEC API error: ${response.status}`);
//       }

//       const rawData = await response.json();
//       const validatedData = SECFilingSchema.parse(rawData);

//       return validatedData;
//     } catch (error) {
//       console.error('Failed to fetch SEC filing:', error);
//       throw new Error('Failed to fetch SEC filing data');
//     }
//   }

//   /**
//    * Fetch Twitter mentions with validation
//    */
//   async fetchTwitterMentions(
//     query: string,
//     maxResults = 100
//   ): Promise<TwitterMention[]> {
//     try {
//       const params = new URLSearchParams({
//         query,
//         max_results: maxResults.toString(),
//         'tweet.fields': 'created_at,public_metrics,entities',
//         'user.fields': 'username',
//         expansions: 'author_id',
//       });

//       const response = await fetch(
//         `${this.TWITTER_API_BASE}/tweets/search/recent?${params}`,
//         {
//           headers: {
//             Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
//           },
//           next: {
//             revalidate: 1800, // Cache for 30 minutes
//             tags: ['twitter-mentions', query],
//           },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Twitter API error: ${response.status}`);
//       }

//       const rawData = await response.json();

//       // Validate each mention
//       const validatedMentions =
//         rawData.data?.map((mention: unknown) =>
//           TwitterMentionSchema.parse(mention)
//         ) || [];

//       return validatedMentions;
//     } catch (error) {
//       console.error('Failed to fetch Twitter mentions:', error);
//       throw new Error('Failed to fetch Twitter mentions');
//     }
//   }

//   /**
//    * Store IPO data in database with transaction
//    */
//   async storeIPOData(calendarData: IPOCalendarData): Promise<void> {
//     try {
//       await db.$transaction(async (tx) => {
//         for (const ipoItem of calendarData.data) {
//           // Create or update company
//           const company = await tx.company.upsert({
//             where: {
//               ticker:
//                 ipoItem.ticker ||
//                 `temp_${ipoItem.company.replace(/\s+/g, '_')}`,
//             },
//             update: {
//               name: ipoItem.company,
//               exchange: ipoItem.exchange,
//               sector: ipoItem.sector,
//               industry: ipoItem.industry,
//               description: ipoItem.description,
//               website: ipoItem.website,
//             },
//             create: {
//               name: ipoItem.company,
//               ticker: ipoItem.ticker,
//               exchange: ipoItem.exchange,
//               sector: ipoItem.sector,
//               industry: ipoItem.industry,
//               description: ipoItem.description,
//               website: ipoItem.website,
//             },
//           });

//           // Create or update IPO
//           await tx.iPO.upsert({
//             where: {
//               companyId: company.id,
//             },
//             update: {
//               filingDate: ipoItem.filingDate
//                 ? new Date(ipoItem.filingDate)
//                 : null,
//               expectedDate: ipoItem.expectedDate
//                 ? new Date(ipoItem.expectedDate)
//                 : null,
//               sharesOffered: ipoItem.sharesOffered
//                 ? BigInt(ipoItem.sharesOffered.replace(/,/g, ''))
//                 : null,
//               priceRangeLow: ipoItem.priceRangeLow
//                 ? parseFloat(ipoItem.priceRangeLow)
//                 : null,
//               priceRangeHigh: ipoItem.priceRangeHigh
//                 ? parseFloat(ipoItem.priceRangeHigh)
//                 : null,
//               marketCap: ipoItem.marketCap
//                 ? BigInt(ipoItem.marketCap.replace(/[,$]/g, ''))
//                 : null,
//             },
//             create: {
//               companyId: company.id,
//               filingDate: ipoItem.filingDate
//                 ? new Date(ipoItem.filingDate)
//                 : null,
//               expectedDate: ipoItem.expectedDate
//                 ? new Date(ipoItem.expectedDate)
//                 : null,
//               sharesOffered: ipoItem.sharesOffered
//                 ? BigInt(ipoItem.sharesOffered.replace(/,/g, ''))
//                 : null,
//               priceRangeLow: ipoItem.priceRangeLow
//                 ? parseFloat(ipoItem.priceRangeLow)
//                 : null,
//               priceRangeHigh: ipoItem.priceRangeHigh
//                 ? parseFloat(ipoItem.priceRangeHigh)
//                 : null,
//               marketCap: ipoItem.marketCap
//                 ? BigInt(ipoItem.marketCap.replace(/[,$]/g, ''))
//                 : null,
//             },
//           });
//         }
//       });

//       // Revalidate cache
//       revalidateTag('ipo-data');
//       console.log(`Stored ${calendarData.data.length} IPO records`);
//     } catch (error) {
//       console.error('Failed to store IPO data:', error);
//       throw new Error('Failed to store IPO data in database');
//     }
//   }

//   /**
//    * Store social mentions in database
//    */
//   async storeSocialMentions(
//     mentions: (TwitterMention | RedditMention)[],
//     platform: 'TWITTER' | 'REDDIT'
//   ): Promise<void> {
//     try {
//       await db.$transaction(async (tx) => {
//         for (const mention of mentions) {
//           const socialMentionData: CreateSocialMentionInput = {
//             platform,
//             postId: mention.id,
//             author:
//               platform === 'TWITTER'
//                 ? mention.author_id
//                 : (mention as RedditMention).author,
//             content:
//               platform === 'TWITTER'
//                 ? (mention as TwitterMention).text
//                 : (mention as RedditMention).title,
//             url:
//               platform === 'TWITTER'
//                 ? `https://twitter.com/user/status/${mention.id}`
//                 : (mention as RedditMention).url,
//             likes:
//               platform === 'TWITTER'
//                 ? (mention as TwitterMention).public_metrics.like_count
//                 : (mention as RedditMention).ups,
//             shares:
//               platform === 'TWITTER'
//                 ? (mention as TwitterMention).public_metrics.retweet_count
//                 : 0,
//             comments:
//               platform === 'TWITTER'
//                 ? (mention as TwitterMention).public_metrics.reply_count
//                 : (mention as RedditMention).num_comments,
//             postedAt:
//               platform === 'TWITTER'
//                 ? new Date((mention as TwitterMention).created_at)
//                 : new Date((mention as RedditMention).created_utc * 1000),
//           };

//           await tx.socialMention.upsert({
//             where: { postId: mention.id },
//             update: socialMentionData,
//             create: socialMentionData,
//           });
//         }
//       });

//       console.log(`Stored ${mentions.length} ${platform} mentions`);
//     } catch (error) {
//       console.error(`Failed to store ${platform} mentions:`, error);
//       throw new Error(`Failed to store ${platform} mentions`);
//     }
//   }

//   /**
//    * Get IPOs from database with filtering
//    */
//   async getIPOs(query: IPOQuery = {}) {
//     try {
//       const { status, sector, industry, startDate, endDate, limit, offset } =
//         query;

//       const ipos = await db.iPO.findMany({
//         where: {
//           ...(status && { status }),
//           ...(startDate && {
//             filingDate: { gte: startDate },
//           }),
//           ...(endDate && {
//             filingDate: { lte: endDate },
//           }),
//           company: {
//             ...(sector && { sector }),
//             ...(industry && { industry }),
//           },
//         },
//         include: {
//           company: true,
//           secFiling: true,
//           socialMentions: {
//             take: 5,
//             orderBy: { createdAt: 'desc' },
//           },
//           _count: {
//             select: {
//               socialMentions: true,
//               userWatchlists: true,
//             },
//           },
//         },
//         orderBy: { filingDate: 'desc' },
//         take: limit,
//         skip: offset,
//       });

//       return ipos;
//     } catch (error) {
//       console.error('Failed to fetch IPOs from database:', error);
//       throw new Error('Failed to fetch IPO data');
//     }
//   }

//   /**
//    * Refresh all IPO data (for scheduled jobs)
//    */
//   async refreshAllData(): Promise<void> {
//     try {
//       console.log('Starting IPO data refresh...');

//       // Fetch fresh data from APIs
//       const calendarData = await this.fetchIPOCalendar();

//       // Store in database
//       await this.storeIPOData(calendarData);

//       // Fetch social mentions for trending IPOs
//       const trendingIPOs = await this.getIPOs({ limit: 10 });

//       for (const ipo of trendingIPOs) {
//         if (ipo.company.ticker) {
//           try {
//             const twitterMentions = await this.fetchTwitterMentions(
//               `$${ipo.company.ticker} IPO`,
//               50
//             );
//             await this.storeSocialMentions(twitterMentions, 'TWITTER');
//           } catch (error) {
//             console.warn(
//               `Failed to fetch social mentions for ${ipo.company.ticker}:`,
//               error
//             );
//           }
//         }
//       }

//       console.log('IPO data refresh completed');
//     } catch (error) {
//       console.error('Failed to refresh IPO data:', error);
//       throw error;
//     }
//   }
// }

// // Export singleton instance
// export const ipoDataService = IPODataService.getInstance();
