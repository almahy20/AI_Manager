export async function fetchToolMetadata(url: string) {
  try {
    const response = await fetch("/api/metadata", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching metadata:", error);
    return null;
  }
}
