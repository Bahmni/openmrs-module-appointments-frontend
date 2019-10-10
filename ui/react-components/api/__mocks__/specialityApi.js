const specialities = [
    {
        name: 'Cardiology',
        uuid: '78ec2222-2222-457d-b798-fe37c3dc7256'
    },
    {
        name: 'Neurology',
        uuid: '78ec2222-1212-457d-b798-fe37c3dc7256'
    }
];

export const getAllSpecialities = () => {
    return new Promise((resolve, reject) => {
        process.nextTick(() =>
            resolve(specialities)
        );
    });
};
