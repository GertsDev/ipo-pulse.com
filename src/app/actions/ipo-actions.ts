// 'use server';

// import { db } from '@/lib/db';
// import { ipoDataService } from '@/lib/services/ipo-data-service';
// import {
//   AddToWatchlistSchema,
//   IPOQuerySchema,
//   UpdateWatchlistSchema,
//   type IPOQuery,
// } from '@/lib/validations/ipo-schemas';
// import { auth } from '@clerk/nextjs/server';
// import { revalidatePath, revalidateTag } from 'next/cache';

// /**
//  * Server Actions for IPO Data Operations
//  * All actions include proper validation, error handling, and cache revalidation
//  */

// export type ActionResponse<T = any> = {
//   success: boolean;
//   data?: T;
//   error?: string;
//   fieldErrors?: Record<string, string[]>;
// };

// /**
//  * Refresh IPO data from external APIs
//  */
// export async function refreshIPODataAction(): Promise<ActionResponse> {
//   try {
//     await ipoDataService.refreshAllData();

//     // Revalidate related pages and cache tags
//     revalidateTag('ipo-calendar');
//     revalidateTag('ipo-data');
//     revalidatePath('/dashboard/ipo-calendar');

//     return { success: true };
//   } catch (error) {
//     console.error('Failed to refresh IPO data:', error);
//     return {
//       success: false,
//       error: 'Failed to refresh IPO data. Please try again.',
//     };
//   }
// }

// /**
//  * Get filtered IPO data
//  */
// export async function getIPOsAction(
//   query: IPOQuery = {}
// ): Promise<ActionResponse> {
//   try {
//     // Validate query parameters
//     const validatedQuery = IPOQuerySchema.parse(query);

//     const ipos = await ipoDataService.getIPOs(validatedQuery);

//     return { success: true, data: ipos };
//   } catch (error) {
//     console.error('Failed to fetch IPOs:', error);

//     if (error instanceof Error && error.name === 'ZodError') {
//       return {
//         success: false,
//         error: 'Invalid query parameters',
//         fieldErrors: JSON.parse(error.message),
//       };
//     }

//     return {
//       success: false,
//       error: 'Failed to fetch IPO data',
//     };
//   }
// }

// /**
//  * Add IPO to user's watchlist
//  */
// export async function addToWatchlistAction(
//   prevState: any,
//   formData: FormData
// ): Promise<ActionResponse> {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return { success: false, error: 'Authentication required' };
//     }

//     // Extract and validate form data
//     const rawData = {
//       ipoId: formData.get('ipoId') as string,
//       alertsEnabled: formData.get('alertsEnabled') === 'true',
//       notes: (formData.get('notes') as string) || undefined,
//     };

//     const validatedData = AddToWatchlistSchema.parse(rawData);

//     // Ensure user exists in database
//     const user = await db.user.upsert({
//       where: { clerkId: userId },
//       update: {},
//       create: {
//         clerkId: userId,
//         email: '', // Will be updated from Clerk webhook
//       },
//     });

//     // Add to watchlist
//     await db.userWatchlist.create({
//       data: {
//         userId: user.id,
//         ipoId: validatedData.ipoId,
//         alertsEnabled: validatedData.alertsEnabled,
//         notes: validatedData.notes,
//       },
//     });

//     revalidatePath('/dashboard/watchlist');

//     return { success: true };
//   } catch (error) {
//     console.error('Failed to add to watchlist:', error);

//     if (error instanceof Error && error.name === 'ZodError') {
//       return {
//         success: false,
//         error: 'Invalid input data',
//         fieldErrors: JSON.parse(error.message),
//       };
//     }

//     // Handle unique constraint violation
//     if (error instanceof Error && error.message.includes('Unique constraint')) {
//       return {
//         success: false,
//         error: 'This IPO is already in your watchlist',
//       };
//     }

//     return {
//       success: false,
//       error: 'Failed to add to watchlist',
//     };
//   }
// }

// /**
//  * Update watchlist item
//  */
// export async function updateWatchlistAction(
//   prevState: any,
//   formData: FormData
// ): Promise<ActionResponse> {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return { success: false, error: 'Authentication required' };
//     }

//     const rawData = {
//       id: formData.get('id') as string,
//       alertsEnabled: formData.get('alertsEnabled') === 'true',
//       notes: (formData.get('notes') as string) || undefined,
//     };

//     const validatedData = UpdateWatchlistSchema.parse(rawData);

//     // Verify ownership
//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     });

//     if (!user) {
//       return { success: false, error: 'User not found' };
//     }

//     await db.userWatchlist.update({
//       where: {
//         id: validatedData.id,
//         userId: user.id, // Ensure user owns this watchlist item
//       },
//       data: {
//         alertsEnabled: validatedData.alertsEnabled,
//         notes: validatedData.notes,
//       },
//     });

//     revalidatePath('/dashboard/watchlist');

//     return { success: true };
//   } catch (error) {
//     console.error('Failed to update watchlist:', error);

//     if (error instanceof Error && error.name === 'ZodError') {
//       return {
//         success: false,
//         error: 'Invalid input data',
//         fieldErrors: JSON.parse(error.message),
//       };
//     }

//     return {
//       success: false,
//       error: 'Failed to update watchlist item',
//     };
//   }
// }

// /**
//  * Remove IPO from watchlist
//  */
// export async function removeFromWatchlistAction(
//   watchlistId: string
// ): Promise<ActionResponse> {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return { success: false, error: 'Authentication required' };
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     });

//     if (!user) {
//       return { success: false, error: 'User not found' };
//     }

//     await db.userWatchlist.delete({
//       where: {
//         id: watchlistId,
//         userId: user.id, // Ensure user owns this watchlist item
//       },
//     });

//     revalidatePath('/dashboard/watchlist');

//     return { success: true };
//   } catch (error) {
//     console.error('Failed to remove from watchlist:', error);
//     return {
//       success: false,
//       error: 'Failed to remove from watchlist',
//     };
//   }
// }

// /**
//  * Get user's watchlist
//  */
// export async function getUserWatchlistAction(): Promise<ActionResponse> {
//   try {
//     const { userId } = auth();

//     if (!userId) {
//       return { success: false, error: 'Authentication required' };
//     }

//     const user = await db.user.findUnique({
//       where: { clerkId: userId },
//     });

//     if (!user) {
//       return { success: true, data: [] };
//     }

//     const watchlist = await db.userWatchlist.findMany({
//       where: { userId: user.id },
//       include: {
//         ipo: {
//           include: {
//             company: true,
//             socialMentions: {
//               take: 3,
//               orderBy: { createdAt: 'desc' },
//             },
//             _count: {
//               select: {
//                 socialMentions: true,
//               },
//             },
//           },
//         },
//       },
//       orderBy: { createdAt: 'desc' },
//     });

//     return { success: true, data: watchlist };
//   } catch (error) {
//     console.error('Failed to fetch watchlist:', error);
//     return {
//       success: false,
//       error: 'Failed to fetch watchlist',
//     };
//   }
// }

// /**
//  * Search IPOs with text query
//  */
// export async function searchIPOsAction(
//   searchQuery: string
// ): Promise<ActionResponse> {
//   try {
//     if (!searchQuery.trim()) {
//       return { success: true, data: [] };
//     }

//     const ipos = await db.iPO.findMany({
//       where: {
//         OR: [
//           {
//             company: {
//               name: {
//                 contains: searchQuery,
//                 mode: 'insensitive',
//               },
//             },
//           },
//           {
//             company: {
//               ticker: {
//                 contains: searchQuery,
//                 mode: 'insensitive',
//               },
//             },
//           },
//           {
//             company: {
//               sector: {
//                 contains: searchQuery,
//                 mode: 'insensitive',
//               },
//             },
//           },
//         ],
//       },
//       include: {
//         company: true,
//         _count: {
//           select: {
//             socialMentions: true,
//             userWatchlists: true,
//           },
//         },
//       },
//       take: 20,
//       orderBy: { filingDate: 'desc' },
//     });

//     return { success: true, data: ipos };
//   } catch (error) {
//     console.error('Failed to search IPOs:', error);
//     return {
//       success: false,
//       error: 'Failed to search IPOs',
//     };
//   }
// }
