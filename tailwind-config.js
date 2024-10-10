tailwind.config = {
    theme: {
        extend: {
            height: {
                '128': '30rem', // Example of height larger than h-96 (which is 24rem)
                '144': '36rem',
            },
            fontFamily: {
                'arial': ['Arial', 'sans-serif'],
                'roboto': ['Roboto', 'sans-serif'],
                'engravers': ['"Engravers MT"', 'sans-serif'], // Add Engravers MT
            }
        }
    }
};
