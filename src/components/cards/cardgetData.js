export const getinfo = (data) => {
  const type = data.category?.toLowerCase()?.trim();
  

  if (
    type === "вино" ||
    type === "шампанское" ||
    type === "ШампанскоеВподарок"
  ) {
    return `
   ${
     data.characteristics?.wineCharacteristics?.["Страна, регион"]
       ? data.characteristics?.wineCharacteristics?.["Страна, регион"]
       : ""
   } ${", "}
   ${
     data.characteristics?.wineCharacteristics?.Объем
       ? data.characteristics?.wineCharacteristics?.Объем
       : ""
   }${", "}
   ${
     data.characteristics?.wineCharacteristics?.Вино
       ? data.characteristics?.wineCharacteristics?.Вино
       : ""
   }${", "}
   ${
     data.characteristics?.wineCharacteristics?.Сахар
       ? data.characteristics?.wineCharacteristics?.Сахар
       : ""
   }

   `;
  }else if (type === "виски" || type === "вискивподарок"){
    return `
     ${
       data.characteristics?.wineCharacteristics?.["Страна, регион"]
         ? data.characteristics?.wineCharacteristics?.["Страна, регион"]
         : ""
     } ${", "}
     ${
       data.characteristics?.wineCharacteristics?.Тип
         ? data.characteristics?.wineCharacteristics?.Тип
         : ""
     } ${", "}
     ${
       data.characteristics?.wineCharacteristics?.Объем
         ? data.characteristics?.wineCharacteristics?.Объем
         : ""
     }${", "}
    `;
  } else if (type === "коньяк" || type === "коньякподарок") {
    return `
     ${
       data.characteristics?.wineCharacteristics?.["Страна, регион"]
         ? data.characteristics?.wineCharacteristics?.["Страна, регион"]
         : ""
     } ${", "}
        ${
          data.characteristics?.wineCharacteristics?.Объем
            ? data.characteristics?.wineCharacteristics?.Объем
            : ""
        }${", "}
         ${
           data.characteristics?.wineCharacteristics?.Класс
             ? data.characteristics?.wineCharacteristics?.Класс
             : ""
         }${", "}
     `;
  }else if (type === 'джин') {
    return `${
      data.characteristics?.Characteristics?.["Страна, регион"]
        ? data.characteristics?.Characteristics?.["Страна, регион"]
        : ""
    } 
     ${
       data.characteristics?.Characteristics?.Объем
         ? data.characteristics?.Characteristics?.Объем
         : ""
     }`;
  }
  return "";
};
