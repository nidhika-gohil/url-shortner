import supabase, { supabaseUrl } from "./supabase";
export async function getUrls(user_id) {
  const {data, error} = await supabase
    .from("url")
    .select("*")
    .eq("user_id", user_id);

  if(error) {
    console.error(error.message);
    throw new Error("Unable to load urls.");
  }

  return data;
};

export async function deleteUrl(urlId) {
  const {data, error} = await supabase
    .from("url")
    .delete()
    .eq("id", urlId);

  if(error) {
    console.error(error.message);
    throw new Error("Unable to delete urls.");
  }

  return data;
};

export async function getUrl({id,user_id}) {
  const {data, error} = await supabase
    .from("url")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if(error) {
    console.error(error.message);
    throw new Error("Unable to get url.");
  }

  return data;
};

export async function createUrl({title, originalUrl, customUrl, user_id}, qrCode) {
  const shortUrl = Math.random().toString(36).substring(2,8);
  const fileName = `qr-${shortUrl}`;
  const { error: storageError} = await supabase.storage.from("qr").upload(fileName, qrCode);
  if(storageError) throw new Error(storageError.message);
  const qr =  `${supabaseUrl}/storage/v1/object/public/qr/${fileName}`;
  const {data, error} = await supabase
    .from("url")
    .insert([
      {
        title,
        original_url: originalUrl,
        custom_url: customUrl || null,
        user_id,
        short_url: shortUrl,
        qr
      }
    ]).select();

  if(error) {
    console.error(error.message);
    throw new Error("Error creating data.");
  }

  return data;
};

export async function getLongUrl(id) {
  const {data, error} = await supabase
    .from("url")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if(error) {
    console.error(error.message);
    throw new Error("Unable to fetch short link.");
  }

  return data;
};
