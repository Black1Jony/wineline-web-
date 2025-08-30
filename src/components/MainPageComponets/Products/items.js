import api from "../../../utils/api";

const raiting = async (url) => {
  try {
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const firstitems = async () => {
  const data = await raiting("/all?limit=25");
  const alcohol = await raiting(
    "/all?sortBy=alcohol&limit=25"
  );
  
  const promotion = await raiting(
    "/all?sortBy=promotion&limit=25"
  );

  const items = [
    { id: 1, name: "Рейтинг", value: data },
    {id:2, name:'Крепость', value: alcohol},
    {id:3, name:'Акции', value: promotion}
  ];

 return items
};

export const secondItems = async () => {
  const ksn = await raiting("/ksn");
  const prs = await raiting(
    "/present"
  );
  const prsKonyak = await raiting("/present?type=konyak");
    const prsViski = await raiting(
      "/present?type=viski"
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
  const data = await raiting("/all?sortBy=sale");
 


  const items = [
    { id: 1, name: "Xиты продаж", value: data },
  ];

  return items;
};