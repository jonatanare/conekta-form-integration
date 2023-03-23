const conekta = require('conekta');
conekta.locale = 'es';
conekta.api_key = process.env.CONEKTA_SECRET_KEY;
export default async function handler(req, res) {
    const data = req.body
    const customer = await conekta.Customer.create({
        name: data.name,
        email: data.email,
        phone: data.phone
    })

    const order = await conekta.Order.create({
        currency: 'MXN',
        customer_info: {
            customer_id: customer._id
        },
        line_items: [
            {
                name: data.typePayment,
                unit_price: data.amount * 100,
                quantity: 1
            }
        ],
        checkout: {
            type: 'Integration',
            allowed_payment_methods: ['card'], //Habilita todos los metodos de pago
            monthly_installments_enabled: true, //Habilita meses sin intereses
            monthly_installments_options: [3, 6] //Cantidad de cuotas
        }
    })

    const orderObject = order.toObject()

    res.send({
        customer_id: customer._id,
        checkout_id: orderObject.checkout.id
    })

}   