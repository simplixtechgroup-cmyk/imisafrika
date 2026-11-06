#!/usr/bin/env python3
"""
IMIS AFRIKA : changer l'adresse du site en une commande.

Usage :
    python3 outils/changer-domaine.py https://www.imisafrika.com/
    python3 outils/changer-domaine.py https://www.imisafrika.com/ --dry-run   (simple vérification)

Remplace l'ancienne adresse par la nouvelle dans : balises canoniques, Open Graph, Twitter,
données structurées (JSON-LD), sitemap.xml, robots.txt, 404.html, security.txt.
Prérequis : Python 3 (installé par défaut sur Mac et Linux ; sur Windows : python.org).
"""
import os, re, sys

racine = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = [a for a in sys.argv[1:] if not a.startswith("--")]
dry = "--dry-run" in sys.argv
if not args or not re.match(r"^https://[a-z0-9.-]+(/[^\s]*)?$", args[0], re.I):
    sys.exit("Indiquez la nouvelle adresse complète, en https. Exemple : python3 outils/changer-domaine.py https://www.imisafrika.com/")
nouveau = args[0].rstrip("/") + "/"

with open(os.path.join(racine, "index.html"), encoding="utf-8") as f:
    m = re.search(r'<link rel="canonical" href="([^"]+)"', f.read())
if not m:
    sys.exit("Adresse actuelle introuvable dans index.html.")
ancien = m.group(1)
if ancien == nouveau:
    sys.exit("Le site utilise déjà cette adresse : " + nouveau)

EXT = (".html", ".xml", ".txt", ".webmanifest", ".json", ".htaccess", "_headers", "security.txt")
total = 0
for dossier, sous, fichiers in os.walk(racine):
    sous[:] = [d for d in sous if d not in (".git", "node_modules")]
    for nom in fichiers:
        if not nom.endswith(EXT) or nom == "LISEZ-MOI.txt":
            continue
        chemin = os.path.join(dossier, nom)
        with open(chemin, encoding="utf-8") as f:
            txt = f.read()
        n = txt.count(ancien)
        if n:
            total += n
            print(("[simulation] " if dry else "") + "%3d remplacement(s)  %s" % (n, os.path.relpath(chemin, racine)))
            if not dry:
                with open(chemin, "w", encoding="utf-8") as f:
                    f.write(txt.replace(ancien, nouveau))
print("\n%s -> %s : %d occurrence(s) %s." % (ancien, nouveau, total, "à modifier" if dry else "modifiée(s)"))
if not dry:
    print("Étapes suivantes : republier le dossier, puis déclarer le sitemap dans Google Search Console.")
