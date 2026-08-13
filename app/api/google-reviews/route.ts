const PLACE_ID = "ChIJ-aRKuIMPQjERZtW8Nn4TC2Q";

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Google Reviews are temporarily unavailable." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=en`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "id,displayName,formattedAddress,rating,userRatingCount,reviews,googleMapsUri",
        },
      },
    );

    if (!response.ok) {
      return Response.json(
        { error: "Google Reviews are temporarily unavailable." },
        { status: 502 },
      );
    }

    const place = (await response.json()) as {
      id: string;
      displayName?: { text?: string };
      formattedAddress?: string;
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: Array<{
        name?: string;
        rating?: number;
        relativePublishTimeDescription?: string;
        publishTime?: string;
        googleMapsUri?: string;
        text?: { text?: string };
        originalText?: { text?: string };
        authorAttribution?: {
          displayName?: string;
          uri?: string;
          photoUri?: string;
        };
      }>;
    };

    return Response.json(
      {
        id: place.id,
        name: place.displayName?.text || "INHERE Hội An",
        address: place.formattedAddress || "24 Đào Duy Từ, Hội An",
        rating: place.rating || 5,
        reviewCount: place.userRatingCount || 0,
        googleMapsUri:
          place.googleMapsUri || "https://share.google/f9N75ZoAa9r6lJhJ1",
        reviews: (place.reviews || []).map((review) => ({
          id:
            review.name ||
            `${review.authorAttribution?.displayName}-${review.publishTime}`,
          author: review.authorAttribution?.displayName || "Google reviewer",
          authorUri: review.authorAttribution?.uri || null,
          avatar: review.authorAttribution?.photoUri || null,
          rating: review.rating || 5,
          text: review.text?.text || review.originalText?.text || "",
          published: review.relativePublishTimeDescription || "",
          googleMapsUri: review.googleMapsUri || place.googleMapsUri,
        })),
      },
      {
        headers: {
          "Cache-Control": "public, max-age=1800, s-maxage=3600",
        },
      },
    );
  } catch {
    return Response.json(
      { error: "Google Reviews are temporarily unavailable." },
      { status: 502 },
    );
  }
}
