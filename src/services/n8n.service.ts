import axios from "axios";

class N8nService {
  async sendMessage(message: string): Promise<{ status: number; data: unknown }> {
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL;

    if (!n8nWebhookUrl) {
      const error = new Error("N8N_WEBHOOK_URL no está configurada.");
      (error as Error & { statusCode?: number }).statusCode = 500;
      throw error;
    }

    try {
      const response = await axios.post(n8nWebhookUrl, { input: message });
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 502;
        const message = error.response?.data?.error ?? "Error al comunicarse con n8n.";
        const axiosError = new Error(message);
        (axiosError as Error & { statusCode?: number }).statusCode = status;
        throw axiosError;
      }

      throw new Error("Error interno del servidor.");
    }
  }
}

export const n8nService = new N8nService();
