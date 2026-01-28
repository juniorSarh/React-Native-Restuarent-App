import React from "react";
import { Alert, Button, View } from "react-native";
import { usePaystack } from "react-native-paystack-webview";
import { auth } from "../config/firebase";
import { createOrder } from "../services/orders";

interface CheckoutProps {
  items: any[];
  total: number;
  onSuccess: () => void;
}

export const Checkout: React.FC<CheckoutProps> = ({ items, total, onSuccess }) => {
  const { popup } = usePaystack();

  const handlePay = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "Please login to place an order");
      return;
    }

    if (items.length === 0) {
      Alert.alert("Error", "Your cart is empty");
      return;
    }

    try {
      // Paystack for South Africa uses Rands directly (no conversion needed)
      const amount = total; // Use total directly as it's already in Rands

      await popup.checkout({
        email: auth.currentUser.email || "customer@example.com",
        amount: amount,
        onSuccess: async (res) => {
          console.log("Payment successful:", res);
          
          try {
            // Create order in Firestore after successful payment
            const orderId = await createOrder(items, total, 'paid');
            
            Alert.alert(
              "Payment Successful", 
              `Your order #${orderId.slice(-8)} has been placed successfully!`,
              [
                {
                  text: "OK",
                  onPress: () => {
                    onSuccess(); // Clear cart
                  }
                }
              ]
            );
          } catch (orderError: any) {
            console.error("Error creating order:", orderError);
            Alert.alert(
              "Payment Successful", 
              "Payment was successful but there was an issue creating your order. Please contact support.",
              [
                {
                  text: "OK",
                  onPress: () => {
                    onSuccess(); // Still clear cart since payment was successful
                  }
                }
              ]
            );
          }
        },
        onCancel: () => {
          console.log("User cancelled payment");
          Alert.alert("Payment Cancelled", "You cancelled the payment process.");
        },
        onError: (error) => {
          console.error("Payment error:", error);
          Alert.alert("Payment Error", "An error occurred during payment. Please try again.");
        },
      });
    } catch (error: any) {
      console.error("Payment initialization error:", error);
      Alert.alert("Error", "Failed to initialize payment. Please try again.");
    }
  };

  return (
    <View style={{ width: '100%' }}>
      <Button 
        title="Pay with Paystack" 
        onPress={handlePay}
        color="#4CAF50"
      />
    </View>
  );
};