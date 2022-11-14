import studentApi from 'JS/api/productApi.js';

const main = async () => {
  try {
    const response = await studentApi.getAll();
    console.log(response);
  } catch (error) {
    console.log('Failed to fetch student list:', error);
  }
};

main();