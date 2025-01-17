import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';

interface Owner {
    _id: string;
    HN: string;
    first_name: string;
    last_name: string;
    phone: string;
    email: string;
}

interface ownerService {
    owner: Owner[]; 
    loading: boolean;
    error?: string;
    setOwner: (owner: Owner[]) => void;
    fetchOwners(): Promise<void>;
    createOwner(ownerData: any): Promise<void>;
    updateOwner(_id: string, ownerData: Partial<Owner>): Promise<void>;
    deleteOwner(_id: string): Promise<void>;
}

export const ownerService = create<ownerService>((set) => ({
    owner: [],
    loading: false,

    setOwner: (owner) => set({ owner }),
    
    fetchOwners: async () => {
        set({ loading: true });
        try {
            const response = await axios.get('/api/owners');
            set({ owner: response.data.data, loading: false });
        } catch (error: any) {
            console.error("Error fetching owners:", error.response?.data || error.message);
            const errorMessage = error.response?.data?.error || "Failed to fetch products";
            set({ error: errorMessage, loading: false });
        }
    },
    createOwner: async (ownerData) => {
        set({ loading: true });
        try {
            const response = await axios.post('/api/owners', ownerData);
            set((prevstate) => ({ owner: [...prevstate.owner, response.data],
            loading: false }));
            toast.success("Owner created successfully");
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to create owner";
            set({ error: errorMessage, loading: false });  
            toast.error(errorMessage);
        }
    },
    updateOwner: async (_id, ownerData) => {
        set({ loading: true });
        try {
            const response = await axios.patch(`/api/owners/${_id}`, ownerData);
            set((prevstate) => ({
                owner: prevstate.owner.map((owner) =>
                    owner._id === _id ? response.data : owner
                ),
                loading: false,
            }));
            toast.success("Owner updated successfully");
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to update owner";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
        }
    },
    deleteOwner: async (_id) => {
        set({ loading: true });
        try {
            await axios.delete(`/api/owners/${_id}`);
            set((prevstate) => ({
                owner: prevstate.owner.filter((owner) => owner._id !== _id),
                loading: false,
            }));
            toast.success("Owner deleted successfully");
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || "Failed to delete owner";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
    }
}}));