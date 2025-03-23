import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
    id: number | string;
    title: string;
    imageUrl: string;
    content?: string;
    description?: string;
    price: number;
    origin_price?: number;
    quantity: number;
}

interface AddToCartPayload {
    product: {
        id: number | string;
        title: string;
        imageUrl?: string;
        content?: string;
        description?: string;
        price: number;
        origin_price?: number;
    };
    quantity: number;
}

const initialState: CartItem[] = [];

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
            const { product, quantity } = action.payload;
            const existingItem = state.find(item => item.id === product.id);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.push({
                    ...product,
                    imageUrl: product.imageUrl || '',
                    quantity
                });
            }
        },
        removeFromCart: (state, action: PayloadAction<string | number>) => {
            const itemId = action.payload;
            return state.filter(item => item.id !== itemId);
        },
        updateCartItemQuantity: (state, action: PayloadAction<{ id: string | number, quantity: number }>) => {
            const { id, quantity } = action.payload;
            const item = state.find(item => item.id === id);
            if (item) {
                item.quantity = quantity;
            }
        },
        clearCart: () => {
            return initialState;
        }
    }
});

export const { addToCart, removeFromCart, updateCartItemQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
