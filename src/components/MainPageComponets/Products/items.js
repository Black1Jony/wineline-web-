import axios from "axios";

const raiting = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const firstitems = async () => {
  const data = await raiting("http://localhost:3000/all?limit=25");
  const alcohol = await raiting(
    "http://localhost:3000/all?sortBy=alcohol&limit=25"
  );
  
  const promotion = await raiting(
    "http://localhost:3000/all?sortBy=promotion&limit=25"
  );

  const items = [
    { id: 1, name: "Рейтинг", value: data },
    {id:2, name:'Крепость', value: alcohol},
    {id:3, name:'Акции', value: promotion}
  ];

 return items
};

export const secondItems = async () => {
  const ksn = await raiting("http://localhost:3000/ksn");
  const prs = await raiting(
    "http://localhost:3000/present"
  );
  const prsKonyak = await raiting("http://localhost:3000/present?type=konyak");
    const prsViski = await raiting(
      "http://localhost:3000/present?type=viski"
    );


  const items = [
    { id: 1, name: "Крепкие напитки", value: ksn },
    { id: 2, name: "игристое в подарок", value: prs },
    { id: 3, name: "коньяк в подарок", value: prsKonyak },
    { id: 4, name: "Виски в подарок", value: prsViski}
  ];

  return items;
};

export const thirdItems = async () => {
  const data = await raiting("http://localhost:3000/all?sortBy=sale");
 


  const items = [
    { id: 1, name: "Xиты продаж", value: data },
  ];

  return items;
};