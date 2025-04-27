import { mockApi } from "@/lib/mockData";
import { NextResponse } from "next/server";

export const runtime = "edge";

// Implementation of Route Handlers with minimal type definitions for Next.js 15.3.0 compatibility
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function GET(request: Request, context: any) {
	try {
		const id = context.params.id;
		const data = await mockApi.getStoreById(id);

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching store:", error);
		return NextResponse.json(
			{ error: "指定された会場が見つかりませんでした" },
			{ status: 404 },
		);
	}
}
