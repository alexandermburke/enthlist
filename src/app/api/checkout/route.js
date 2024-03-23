import { NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
})
// const priceIds = ['price_1OntVFA5WZW9pYpgJuRDy9Ne', 'price_1OocwSA5WZW9pYpgmfj7czX8']
const priceIds = ['price_1OpFAuA5WZW9pYpgbVmrA8Xv', 'price_1OpFAuA5WZW9pYpgbVmrA8Xv']

////////////////////////// BILLING //////////////////////////

// To handle a POST request to /api
export async function POST(request) {
    // POST TO CREATE THE ORIGINAL CHECKOUT
    const { customerId, userId, email } = await request.json()
    let stripeCustomerId = customerId

    try {
        //then create stripe customer if required and save id
        if (!customerId) {
            const customer = await stripe.customers.create({
                name: email,
                metadata: {
                    userId
                },
            })
            stripeCustomerId = customer.id
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            metadata: {
                userId,
                email,
                stripeCustomerId,
            },
            line_items: [
                { price: priceIds[1], quantity: 1 },
            ],
            mode: 'subscription',
            cancel_url: 'http://localhost:3000/admin/account',
            success_url: 'http://localhost:3000/admin/success?session_id={CHECKOUT_SESSION_ID}',
            // cancel_url: 'https://swoldierfitness.com/cancel',
            // success_url: 'https://swoldierfitness.com/success',
        })
        return NextResponse.json(session, { status: 201 })
    } catch (err) {
        console.log('Failed to create checkout session', err.message)
        return NextResponse.json({}, { status: 500 })
    }
}

export async function DELETE(request) {
    // delete a membership or pause it
    const { stripeCustomerId, userId } = await request.json()
    // console.log(customer_id, user_id)
    if (!stripeCustomerId || !userId) { return NextResponse.json({}, { status: 500 }) }

    try {
        const customer = await stripe.customers.retrieve(
            stripeCustomerId,
            { expand: ['subscriptions'] }
        )
        // console.log(customer.subscriptions.data[0].id)
        let subscriptionId = customer?.subscriptions?.data?.[0]?.id
        stripe.subscriptions.del(subscriptionId)
        return NextResponse.json({}, { status: 200 })
    } catch (err) {
        console.log('Failed to cancel subscription')
        return NextResponse.json({}, { status: 500 })
    }
}

