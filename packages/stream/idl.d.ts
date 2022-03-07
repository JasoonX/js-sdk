declare const _default: {
    version: string;
    name: string;
    instructions: {
        name: string;
        accounts: {
            name: string;
            isMut: boolean;
            isSigner: boolean;
        }[];
        args: ({
            name: string;
            type: string;
        } | {
            name: string;
            type: {
                array: (string | number)[];
            };
        })[];
    }[];
};
export default _default;
