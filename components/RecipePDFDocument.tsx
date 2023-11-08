import React from "react";
import {
  Document,
  Page,
  Text,
  Image,
  View,
  Font,
  StyleSheet,
} from "@react-pdf/renderer";

interface Props {
  recipe: string;
  title?: string;
}

function RecipePDFDocument({ recipe }: Props) {
  const parsedRecipe = JSON.parse(recipe);

  const { title, image, ingredients, category, cuisine, createdBy, method } =
    parsedRecipe;

  return (
    <Document>
      <Page style={styles.body}>
        <View style={styles.div}>
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.author}>Author: {createdBy.name}</Text>
            <Text style={styles.text}>Category: {category.title}</Text>
            <Text style={styles.text}>Cuisine: {cuisine.title}</Text>
          </View>

          <Image style={styles.image} source={image} alt={title} />
        </View>

        <Text style={styles.subtitle}>Ingredients</Text>
        {ingredients.map((ingredient: { ingredient: string; _id: string }) => (
          <Text style={styles.text} key={ingredient._id}>
            {ingredient.ingredient}
          </Text>
        ))}
        <Text style={styles.subtitle}>Method</Text>
        {method.map((item: { step: string; _id: string }) => (
          <Text style={styles.text} key={item._id}>
            {item.step}
          </Text>
        ))}
      </Page>
    </Document>
  );
}

export default RecipePDFDocument;

Font.register({
  family: "Cormorant",
  src: "/assets/font/Cormorant-VariableFont_wght.ttf",
});

const styles = StyleSheet.create({
  body: {
    padding: 16,
  },
  div: {
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginHorizontal: 8,
  },
  content: {
    width: "100%",
  },
  title: {
    fontSize: 24,
    textAlign: "left",
    fontFamily: "Cormorant",
    fontWeight: "bold",
    marginLeft: 16,
  },
  author: {
    fontSize: 12,
    textAlign: "left",
    fontFamily: "Cormorant",
    marginTop: 8,
    marginLeft: 16,
  },
  subtitle: {
    fontSize: 16,
    margin: 8,
    fontFamily: "Cormorant",
    fontWeight: "semibold",
    textDecoration: "underline",
  },
  text: {
    margin: 6,
    marginLeft: 16,
    fontSize: 14,
    textAlign: "justify",
    fontFamily: "Cormorant",
  },
  image: {
    marginVertical: 15,
    marginTop: 0,
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },
  link: {
    backgroundColor: "brown",
    color: "white",
    width: "fit-content",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: "5px",
  },
});
