const { premium } = require("./ltc");

module.exports = {
   name: "paypal",
   premium: true,
   run: async (client, message, args) => {
      switch(args[0]) {
         default:
            if (!client.db.payments.paypal)
            {
               message.edit(client.language(`*Aucun paypal défini.*`, `*No paypal defined.*`));
            } else if (client.db.payments.paypal)
            {
               message.edit(client.language(`*Votre adresse paypal :* [\`${client.db.payments.paypal}\`](https://paypal.me/${client.db.payments.paypal})`, `*Your paypal address :* [\`${client.db.payments.paypal}\`](https://paypal.me/${client.db.payments.paypal})`));
            }
            break;

         case "add":
            if (!args[1]) return message.edit(client.language(`*Veuillez fournir une adresse paypal.*`, `*Please give an address paypal.*`));

            client.db.payments.paypal = args[1].replaceAll('https://paypal.me/', '');
            client.save();
            message.edit(client.language(
               `*Votre adresse paypal a été ajoutée.*`,
               `*Your paypal address has been added.*`
            ));
            break;
         
         case "remove":
            client.db.payments.paypal = null;
            client.save();
            message.edit(client.language(
               `*Votre adresse paypal a été supprimée.*`,
               `*Your paypal address has been removed.*`
            ));
            break;
      }
   }
}