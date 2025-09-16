// index.js
import { Client, GatewayIntentBits, Partials, EmbedBuilder } from "discord.js";
import "dotenv/config";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel], // necessário para DM
});

client.once("ready", () => {
  console.log(`✅ Logado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Caso a mensagem venha por DM
  if (message.channel.type === 1) {
    const servidor = client.guilds.cache.get(process.env.SERVER_ID);
    if (!servidor) return;

    const canal = servidor.channels.cache.get(process.env.CHANNEL_ID);
    if (!canal?.isTextBased()) return;

    // Cria um embed bonitão
    const embed = new EmbedBuilder()
      .setColor("#5865F2") // azul padrão do Discord
      .setTitle("📢 Nova mensagem recebida!")
      .setDescription(message.content)
      .setFooter({ text: `Enviado por ${message.author.tag}` })
      .setTimestamp();

    // Define a menção (role ou everyone)
    const mention = process.env.ROLE_ID
      ? `<@&${process.env.ROLE_ID}>`
      : "@everyone";

    // Envia
    await canal.send({ content: mention, embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
