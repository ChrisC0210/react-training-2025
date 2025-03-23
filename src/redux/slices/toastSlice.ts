import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ToastState {
    message: string;
    visible: boolean;
}

const initialState: ToastState = {
    message: '',
    visible: false,
};

const toastSlice = createSlice({
    name: 'toast',
    initialState,
    reducers: {
        showToast: (state, action: PayloadAction<string>) => {
            state.message = action.payload;
            state.visible = true;
        },
        hideToast: (state) => {
            state.visible = false;
        },
    },
});

export const { showToast, hideToast } = toastSlice.actions;
export default toastSlice.reducer;
