import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ydlsfrgegqcbiazyilbn.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkbHNmcmdlZ3FjYmlhenlpbGJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxMTUzODgsImV4cCI6MjA4NTY5MTM4OH0.jrXP4v9ZgSLGJw8DUw4AY2CalCoj07a_HRopV108MyI'
const supabase = createClient(supabaseUrl, supabaseKey)

async function checkOrders() {
    console.log('Fetching orders from database...')

    const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('createdat', { ascending: false })

    if (error) {
        console.error('Error fetching orders:', error)
    } else {
        if (data.length > 0) {
            console.log('Available columns in orders table:', Object.keys(data[0]))
        }
        data.forEach(order => {
            console.log('ORDER START ================================')
            console.log(JSON.stringify(order, null, 2))
            console.log('ORDER END ==================================')
        })
    }
}

checkOrders()
