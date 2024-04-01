import { create } from 'zustand';

interface UserState {
    token: string;
    fname: string;
    lname: string;
    image: string;
    roles: string[];
    tags: string[];
}

export const useUserStore = create<UserState>((set, get) => ({
    fname: '',
    lname: '',
    image: '',
    token: '',
    roles: [],
    tags: [],

    login: ({ token, fname, lname, image, roles, tags }: UserState) =>
        set(() => ({
            token,
            fname,
            lname,
            image,
            roles,
            tags,
        })),

    logout: () =>
        set(() => ({
            token: '',
            fname: '',
            lname: '',
            image: '',
            roles: [],
            tags: [],
        })),
}));
