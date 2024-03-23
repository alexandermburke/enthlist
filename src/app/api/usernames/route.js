import { NextResponse } from "next/server"
import { adminDB } from "@/firebaseAdmin"

export async function GET(request) {
    const username = request.nextUrl.searchParams.get("username")
    if (!username) { return NextResponse.json({}, { status: 403 }) }
    try {
        const collectionRef = adminDB.collection('usernames').doc(username);
        const doc = await collectionRef.get();
        let isUnique = false
        if (!doc.exists) {
            isUnique = true
        }
        return NextResponse.json({ isUnique }, { status: 200 })
    } catch (err) {
        console.log(err.message)
        return NextResponse.json({ isUnique: false }, { status: 500 })
    }
}
