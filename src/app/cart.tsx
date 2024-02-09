import { Header } from "@/components/header";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { ProductCartProps, useCartStore } from "./stores/cart-store";
import { Product } from "@/components/product";
import { FormatCurrency } from "@/utils/functions/format-currency";
import { Input } from "@/components/input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button } from "@/components/button";
import { Feather } from "@expo/vector-icons";
import { LinkButton } from "@/components/link.button";
import { useState } from "react";
import { useNavigation } from "expo-router";

const PHONE_NUMBER = "5531989323523";

export default function Cart() {
  const [adress, setAdress] = useState("");
  const cartStore = useCartStore();
  const navigation = useNavigation();

  const total = FormatCurrency(
    cartStore.products.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    )
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert(
      "Remove",
      `Would you like to remove ${product.title} from the cart?`,
      [
        {
          text: "Cancel",
        },
        {
          text: "Remove",
          onPress: () => cartStore.remove(product.id),
        },
      ]
    );
  }

  function handleOrder() {
    if (adress.trim().length === 0) {
      return Alert.alert("Order", "Provide the delivery information");
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} ${product.title}`)
      .join("");

    const message = `
    NEW ORDER
    \n Deliver at: ${adress}
    
    ${products}
    
    \n Total value: ${total}
    `;

    Linking.openURL(
      `https://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );

    cartStore.clear();
    navigation.goBack();
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Your cart" />

      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    onPress={() => handleProductRemove(product)}
                  />
                ))}
              </View>
            ) : (
              <Text className="font-body text-slate-400 text-center my-8">
                Your cart is empty.
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total:</Text>

              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>

            <Input
              placeholder="Provide the delivery address with street, neighborhood, ZIP code, house number, and additional details."
              onChangeText={setAdress}
              blurOnSubmit={true}
              onSubmitEditing={handleOrder}
              returnKeyType="next"
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Submit request</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Back to menu" href="/" />
      </View>
    </View>
  );
}
