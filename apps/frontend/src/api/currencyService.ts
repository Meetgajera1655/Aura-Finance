import api from "@/config/axiosInstance";
import NotificationService from '@/components/NotificationService';

export const getAllCurrency = async () => {
  try {
    const response = await api.get('/currency/getallcurrency');
    return response;
  } catch (error) {
    NotificationService.error('Failed to load currencies. Please try again later.');
    throw error;
  }
}

export const currencyConvert = async (amount: number, from: string, to: string) => {
  try {
    const response = await api.get('/currency/convertcurrency', { params: { amount, from, to } });
    const item = Array.isArray(response.data?.data) ? response.data.data[0] : response.data?.data;
    let convertedStr = "";
    if (item && item.rate) {
      const parsedAmount = parseFloat(item.amount || "1");
      const parsedRate = parseFloat(item.rate.replace(/,/g, ""));
      const rate = parsedAmount === 1 ? parsedRate : parsedRate / parsedAmount;
      convertedStr = (amount * rate).toFixed(2);
    }
    NotificationService.success(`Converted ${amount} ${from} to ${convertedStr ? convertedStr + " " : ""}${to}`);
    return response;
  } catch (error) {
    NotificationService.error('Failed to convert currency. Please check the currency codes and try again.');
    throw error;
  }
}


