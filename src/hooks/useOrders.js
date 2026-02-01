import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useOrders = () => {
    const [data, setData] = useState({
        orders: [],
        totalRevenue: 0,
        orderCount: 0,
        loading: true,
        error: null,
    });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data: orders, error } = await supabase
                    .from('orders')
                    .select('number, description, price, created_at');

                if (error) throw error;

                const revenue = orders.reduce((sum, order) => sum + (Number(order.price) || 0), 0);

                setData({
                    orders,
                    totalRevenue: revenue,
                    orderCount: orders.length,
                    loading: false,
                    error: null,
                });
            } catch (err) {
                console.error('Error fetching orders:', err);
                setData(prev => ({ ...prev, loading: false, error: err.message }));
            }
        };

        fetchOrders();

        // Set up real-time subscription
        const subscription = supabase
            .channel('orders-channel')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
                fetchOrders();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, []);

    return data;
};
