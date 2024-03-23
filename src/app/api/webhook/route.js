import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { adminDB } from "@/firebaseAdmin"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
})
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

////////////////////////// WEBHOOK //////////////////////////
export async function GET(request) {
    return NextResponse.json({ message: 'hi mom' }, { status: 200 })
}


// To handle a POST request to /api
export async function POST(request) {
    console.log('WEBHOOK STARTED')
    try {
        const body = await request.text()
        const sig = headers().get('stripe-signature')//req.headers['stripe-signature']
        // const event = stripe.webhooks.constructEvent(request['rawBody'], sig, process.env.STRIPE_WEBHOOK_KEY)
        const event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
        if (!(event.type in webhookHandlers)) { return NextResponse.json({}, { status: 200 }) }
        await webhookHandlers[event.type](event.data.object)
        return NextResponse.json({}, { status: 200 })
    } catch (err) {
        console.log(err.message)
        return NextResponse.json({}, { status: 500 })
    }
}


const webhookHandlers = {
    'checkout.session.completed': async (data) => {
        //add try catch block you fool
        const { stripeCustomerId, userId, email, } = data.metadata
        await adminDB.collection('users').doc(userId)
            .set({
                billing: { plan: 'Pro', status: true, stripeCustomerId: stripeCustomerId, },
            }, { merge: true })
        console.log('Payment successful')
    },
    'invoice.payment_failed': async (data) => {
        // Add your business logic here
        //add try catch block here too

        const { stripeCustomerId, userId, email, } = data.metadata
        await adminDB.collection('users').doc(userId)
            .set({
                billing: { status: false, }
            }, { merge: true })
    },
}

// 'invoice.paid': async (data) => {
//     const customer_id = data.customer
//     const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
//     const customer = await stripe.customers.retrieve(
//         customer_id
//     )

//     const userId = customer.metadata.userId
//     const userRef = db.collection('users').doc(userId)
//     const date = new Date()
//     const day = date.getDate()
//     const month = date.getMonth() + 1
//     const year = date.getFullYear()
//     const res2 = await userRef.set({
//         billing: { [`${year}/${month}/${day}`]: data.amount_paid / 100 },
//     }, { merge: true })
// },