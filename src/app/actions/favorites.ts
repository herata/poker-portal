"use server";

import { addFavoriteStore, removeFavoriteStore } from "@/lib/api";
import { revalidatePath } from "next/cache";

/**
 * Server action to add a store to favorites
 * Form action用に修正：値を返さないようにしました
 */
export async function addFavoriteAction(storeId: string, formData?: FormData) {
	try {
		const result = await addFavoriteStore(storeId);

		// Revalidate the favorites page and store detail page
		revalidatePath("/favorites");
		revalidatePath(`/stores/${storeId}`);

		// 値を返さない（voidを返す）
	} catch (error) {
		console.error("Error adding favorite:", error);
		// エラーを投げるだけで値は返さない
	}
}

/**
 * Server action to remove a store from favorites
 * Form action用に修正：値を返さないようにしました
 */
export async function removeFavoriteAction(storeId: string, formData?: FormData) {
	try {
		const result = await removeFavoriteStore(storeId);

		// Revalidate the favorites page and store detail page
		revalidatePath("/favorites");
		revalidatePath(`/stores/${storeId}`);

		// 値を返さない（voidを返す）
	} catch (error) {
		console.error("Error removing favorite:", error);
		// エラーを投げるだけで値は返さない
	}
}
