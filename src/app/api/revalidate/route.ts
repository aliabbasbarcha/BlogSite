import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 }
    );
  }

  const body = await request.text();
  const signature = request.headers.get(SIGNATURE_HEADER_NAME);

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: { _type?: string; slug?: string } = {};
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/llms.txt");
  revalidatePath("/sitemap.xml");
  if (payload._type === "post" && payload.slug) {
    revalidatePath(`/blog/${payload.slug}`);
  }

  return NextResponse.json({
    revalidated: true,
    type: payload._type,
    slug: payload.slug,
    now: Date.now(),
  });
}
