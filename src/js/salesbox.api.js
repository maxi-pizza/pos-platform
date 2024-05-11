const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const COMPANY_ID = import.meta.env.VITE_SALESBOX_COMPANY_ID;
const AUTH_TOKEN = import.meta.env.VITE_SALESBOX_AUTH_TOKEN;

export const getOrder = async (id) => {
  const myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${AUTH_TOKEN}`);

  const requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  const endpoint = `${BASE_URL}/${COMPANY_ID}/orders/${id}?lang=uk`;

  return (await fetch(endpoint, requestOptions).then((res) => res.json())).data;
};
