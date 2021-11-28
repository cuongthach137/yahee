const mockProducts = [
  {
    id: 23324424,
    title: "Funk Master",
    size: [7],
    price: 4.07,
    discount: [0, 8.88, 19],
    quantity: 123,
    avgRating: 5,
    category: "flower",
    subCategory: "dried flower",
    slug: "funk-faster",
    ratings: [
      { postedBy: 234124214242, rating: 5, comment: "tuyet voi" },
      { postedBy: 324321232454, rating: 4, comment: "rat la phe luon" },
      {
        postedBy: 323221532454,
        rating: 2,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323241532454,
        rating: 2,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323221652454,
        rating: 3,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323221582454,
        rating: 5,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323298532454,
        rating: 1,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323227432454,
        rating: 3,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323621532454,
        rating: 4.4,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
    ],
    images: [
      {
        id: 789,
        src: "https://cdn.shopify.com/s/files/1/2636/1928/products/00671148301092_00_compress_102065_158804a3-bc75-4d62-b73c-9a040d7d0922_1024x1024.jpg?v=1628696307",
      },
      {
        id: 101112,
        src: "https://cdn.shopify.com/s/files/1/2636/1928/products/00671148301092_a1c1_compress_102065_f971a92f-5a02-4460-9fd8-487039e59b69_1024x1024.jpg?v=1628696307",
      },
    ],
    details: {
      producer: "Organigram",
      brand: "SHRED",
      potency: "Very Strong",
      thc: [18, 24],
      cbd: [0, 0.15],
      plantType: "Hybrid",
      growMethod: "Indoor",
      growRegion: "Moncton",
      dryingMethod: "Rack and Tray",
      terpenes: "Terpenes May Vary",
      brief:
        "A combination of pre-shredded whole-flower with pungent and skunky aromas, THC potent and a humidity pack included.",
      description:
        "We've captured the essence of real dank nugs with skunky, gas and earthy aromas that bring the funk. A combination of sweet skunk, funky cheese and pungent diesel notes. Get down and get dank with Funk Master.",
    },
  },
  {
    id: 23221424,
    title: "Simple Stash",
    size: [5, 10, 28],
    price: 4.39,
    discount: [0, 8.88, 19],
    quantity: 123,
    avgRating: 4.3,
    category: "flower",
    slug: "simple-stash",
    ratings: [
      { postedBy: 234124214242, rating: 5, comment: "tuyet voi" },
      { postedBy: 324321232454, rating: 4, comment: "rat la phe luon" },
      {
        postedBy: 323221532454,
        rating: 2,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323241532454,
        rating: 2,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323221652454,
        rating: 3,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323221582454,
        rating: 5,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323298532454,
        rating: 1,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323227432454,
        rating: 3,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323621532454,
        rating: 4.4,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
    ],
    images: [
      {
        id: 123,
        src: "https://cdn.shopify.com/s/files/1/2636/1928/products/00688083003790_00_compressed_101564_aa914cbe-cd38-47ae-a019-8505c7ff8cf5_1024x1024.jpg?v=1628600492",
      },
      {
        id: 456,
        src: "https://cdn.shopify.com/s/files/1/2636/1928/products/00688083003790_a1c1_en_compress_101564_1024x1024.jpg?v=1628600493",
      },
    ],
    details: {
      producer: "Canopy Growth",
      brand: "Simple Stash",
      potency: "Strong",
      thc: [12, 18],
      cbd: [0, 5],
      plantType: "Savita Dominant",
      growMethod: "Hybrid-GreenHouse",
      growRegion: "Gatineau",
      dryingMethod: "Rack and Tray",
      terpenes: "Alpha-Bisabolol, Beta-Caryophyllene, Terpinolene",
      brief:
        "Proudly grown in Canada, Simple Stash offers consumers quality whole flower without all of the confusion.",
      description:
        "Simple Stash Sativa™ is quality cannabis bud with a medium THC potency potential and little-to-no CBD. Proudly grown in Canada, Simple Stash offers consumers quality whole flower without all of the confusion. Why? Because clarity + affordability = a simple stash. After all, life can be stressful, but cannabis doesn't have to be.",
    },
  },
  {
    id: 2318424,
    title: "Indica Blend",
    size: [28],
    price: 3.57,
    discount: [0, 8.88, 19],
    quantity: 123,
    avgRating: 1,
    category: "flower",
    slug: "indica-blend",
    ratings: [
      { postedBy: 234124214242, rating: 5, comment: "tuyet voi" },
      { postedBy: 324321232454, rating: 4, comment: "rat la phe luon" },
      {
        postedBy: 323221532454,
        rating: 2,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323241532454,
        rating: 2,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323221652454,
        rating: 3,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323221582454,
        rating: 5,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323298532454,
        rating: 1,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323227432454,
        rating: 3,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323621532454,
        rating: 4.4,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
    ],
    images: [
      {
        id: 1314,
        src: "https://cdn.shopify.com/s/files/1/2636/1928/products/00685960002648_01_compress_101886_1024x1024.jpg?v=1628600598",
      },
      {
        id: 1516,
        src: "https://cdn.shopify.com/s/files/1/2636/1928/products/00685960002648_a1c1_compressed_101886_1c57a44a-f5b0-4a65-91f5-e09412cb4d1e_1024x1024.jpg?v=1628600598",
      },
    ],
    details: {
      producer: "Natural MedCo",
      brand: "Eve & Co.",
      potency: "Strong",
      thc: [12, 18],
      cbd: [0, 1.99],
      plantType: "Indica Dominant",
      growMethod: "Hybrid-Greenhouse",
      growingProvince: "Ontario",
      growRegion: "Southern Ontario",
      dryingMethod: "Hang Dry",
      terpenes: "Terpenes May Vary",
      brief:
        "Greenhouse grown in Southwestern Ontario and is hand dried, machine trimmed, and hand finished to maintain optimal taste, flavour and quality.",
      description:
        "Each flower is greenhouse grown in Southwestern Ontario and is hand dried, machine trimmed, and hand finished to maintain optimal taste, flavour and quality.",
    },
  },
  {
    id: 23272424,
    title: "Twd. Sativa Pre-Roll",
    size: [5, 10, 28],
    price: 4.39,
    discount: [0, 8.88, 19],
    quantity: 123,
    avgRating: 2,
    category: "flower",
    subCategory: "pre-rolls",
    slug: "twd-savita-pre-roll",
    ratings: [
      { postedBy: 234124214242, rating: 5, comment: "tuyet voi" },
      { postedBy: 324321232454, rating: 4, comment: "rat la phe luon" },
      {
        postedBy: 323221532454,
        rating: 2,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323241532454,
        rating: 2,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323221652454,
        rating: 3,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323221582454,
        rating: 5,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323298532454,
        rating: 1,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323227432454,
        rating: 3,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
      {
        postedBy: 323621532454,
        rating: 4.4,
        comment: "cũng phê nhưng mà hút xong em bị bế đi đcm",
      },
    ],
    images: [
      {
        id: 19,
        src: "https://cdn.shopify.com/s/files/1/2636/1928/products/00688083004476_00_compress_101936_674301b6-5792-4731-bf75-d97d8389e792_1024x1024.jpg?v=1629815394",
      },
      {
        id: 20,
        src: "https://cdn.shopify.com/s/files/1/2636/1928/products/00688083004476_a1c1_compress_101936_b6c288cf-bba1-45e6-8500-68284cd70d01_1024x1024.jpg?v=1629815394",
      },
    ],
    details: {
      producer: "Canopy Growth",
      brand: "Twd.",
      potency: "Very Strong",
      thc: [16, 22],
      cbd: [0, 0.5],
      plantType: "Savita Dominant",
      growMethod: "Indoor",
      growRegion: "Smith's Falls",
      dryingMethod: "Rack and Tray",
      brief:
        "This set of Twd. Sativa pre-rolls come in a pack of 12. 0.5 g of cannabis per pre-roll.",
      description:
        "This set of Twd. Sativa pre-rolls come in a pack of 12. 0.5 g of cannabis per pre-roll.        ",
    },
  },
];

export default mockProducts;
