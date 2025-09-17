import { Client, GatewayIntentBits, Partials, EmbedBuilder } from "discord.js";
import "dotenv/config";

const PREFIX = ".";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.once("ready", () => {
  console.log(`✅ Logado como ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!message.content.startsWith(PREFIX)) return;

  const args = message.content.slice(PREFIX.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === "pr") {
    const link = args[0];
    const targetBranch = args[1] || "main"; // default "main" se não passar

    // 🗑️ Apaga a mensagem do usuário SEMPRE
    try {
      await message.delete();
    } catch (err) {
      console.error("Erro ao deletar a mensagem:", err);
    }

    if (!link) {
      const warn = await message.channel.send(
        "⚠️ Você precisa passar o link do PR!"
      );
      setTimeout(() => warn.delete().catch(() => {}), 5000); // auto delete
      return;
    }

    // Regex para extrair repo e número do PR
    const regex = /_git\/([^/]+)\/pullrequest\/(\d+)/;
    const match = link.match(regex);

    let repo = "desconhecido";
    let prNumber = "???";

    if (match) {
      repo = match[1];
      prNumber = match[2];
    }

    const embed = new EmbedBuilder()
      .setColor("#00FF7F")
      .setTitle("🚀 PULL REQUEST 🚀")
      .addFields(
        { name: "🔗 Link", value: link },
        { name: "📂 Repositório", value: repo, inline: true },
        { name: "📌 PR Number", value: `#${prNumber}`, inline: true },
        { name: "🌿 Target branch", value: targetBranch }
      )
      .setFooter({ text: `Enviado por ${message.author.tag}` })
      .setTimestamp();

    const mention = process.env.PR_ROLE_ID
      ? `@${process.env.PR_ROLE_ID}`
      : "@everyone";

    await message.channel.send({ content: mention, embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
