export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description || description.trim().length === 0) {
      return Response.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY not configured');
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Expande y profesionaliza en 1-2 líneas esta descripción de servicio/producto para una factura:
"${description}"

Responde SOLO con el texto expandido, sin comillas ni explicaciones.`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const expandedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text || description;

    return Response.json({ expandedDescription: expandedText });
  } catch (error) {
    console.error('Error in expand-description:', error);
    return Response.json(
      { error: 'Failed to expand description' },
      { status: 500 }
    );
  }
}
