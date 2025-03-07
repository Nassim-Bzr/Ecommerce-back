const nodemailer = require('nodemailer');
require('dotenv').config(); // Charger les variables d'environnement

// Configurer le transporteur (Gmail, SMTP...)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Fonction pour envoyer un email stylisé
async function sendOrderConfirmationEmail(to, commande) {
    // ✅ Ajout de la vérification des formats
    const numero_commande = commande.numero_commande;
    const prix_total = commande.prix_total;

    const produitsArray = typeof commande.produits === 'string'
        ? JSON.parse(commande.produits)
        : commande.produits;

    const adresseFacturation = typeof commande.adresse_facturation === 'string'
        ? JSON.parse(commande.adresse_facturation)
        : commande.adresse_facturation;

    const adresseLivraison = typeof commande.adresse_livraison === 'string'
        ? JSON.parse(commande.adresse_livraison)
        : commande.adresse_livraison;

    // 🌟 Style amélioré pour un email professionnel
    const emailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #fdf5eb;">
            <h2 style="background-color: #2A394A; color: white; text-align: center; padding: 15px; border-radius: 8px 8px 0 0;">Confirmation de votre commande</h2>

            <p style="font-size: 16px;">Bonjour <strong>${adresseFacturation.nom_complet}</strong>,</p>
            <p>Merci pour votre commande ! Voici les détails :</p>

            <div style="background-color: #fff; padding: 15px; border-radius: 8px;">
                <h3 style="color: #C97435;">Commande #${numero_commande}</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 15px;">
                    <thead>
                        <tr>
                            <th style="border-bottom: 2px solid #C97435; text-align: left; padding: 8px;">Produit</th>
                            <th style="border-bottom: 2px solid #C97435; text-align: center; padding: 8px;">Quantité</th>
                            <th style="border-bottom: 2px solid #C97435; text-align: right; padding: 8px;">Prix</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${produitsArray.map(p => `
                            <tr>
                                <td style="border-bottom: 1px solid #ddd; padding: 8px;">${p.nom}</td>
                                <td style="border-bottom: 1px solid #ddd; text-align: center; padding: 8px;">${p.quantite}</td>
                                <td style="border-bottom: 1px solid #ddd; text-align: right; padding: 8px;">${p.prix}€</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <p style="text-align: right; font-size: 18px;"><strong>Total : ${prix_total}€</strong></p>
            </div>

            <div style="background-color: #fff; padding: 15px; border-radius: 8px; margin-top: 15px;">
                <h3 style="color: #C97435;">Adresse de Livraison</h3>
                <p>${adresseLivraison.nom_complet}<br>${adresseLivraison.adresse}, ${adresseLivraison.ville}, ${adresseLivraison.code_postal}, ${adresseLivraison.pays}</p>

                <h3 style="color: #C97435;">Adresse de Facturation</h3>
                <p>${adresseFacturation.nom_complet} (${adresseFacturation.email})<br>${adresseFacturation.adresse}, ${adresseFacturation.ville}, ${adresseFacturation.code_postal}, ${adresseFacturation.pays}</p>
            </div>

            <p style="text-align: center; font-size: 14px; color: #555; margin-top: 20px;">Merci pour votre confiance ❤️</p>
        </div>
    `;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject: `Confirmation de votre commande #${numero_commande}`,
        html: emailContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Email envoyé à ${to}`);
    } catch (error) {
        console.error(`❌ Erreur lors de l'envoi de l'email : ${error.message}`);
    }
}

module.exports = { sendOrderConfirmationEmail };
