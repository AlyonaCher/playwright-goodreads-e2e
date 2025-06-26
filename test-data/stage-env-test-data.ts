import dotenv from 'dotenv';
dotenv.config();

export default {
    testData: {
        baseURL: 'https://www.goodreads.com/',

        user: {
            email: process.env.STAGE_USER_EMAIL || '',
            pass: process.env.STAGE_USER_PASS || '',
            name: '',
        },

        booksOnMyShelves: [
            {
                title: '2001: A Space Odyssey (Space Odyssey, #1)',
                author: {
                    firstName: 'Arthur C.',
                    lastName: 'Clarke',
                },
                shelf: 'Read',
            },

            {
                title: '2010: Odyssey Two',
                author: {
                    firstName: 'Arthur C.',
                    lastName: 'Clarke',
                },
                shelf: 'Currently Reading',
            },

            {
                title: '2061: Odyssey Three (Space Odyssey, #3)',
                author: {
                    firstName: 'Arthur C.',
                    lastName: 'Clarke',
                },
                shelf: 'Want To Read',
            },
        ],
        bookForE2eTest: [
            {
                title: '3001: The Final Odyssey',
                author: {
                    firstName: 'Arthur C.',
                    lastName: 'Clarke',
                },
                rating: 4,
            },]

    }
}