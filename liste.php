<?php
require_once __DIR__ . '/config.php';
$history = getPhoneLogsHistory(50); 
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Historique</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap" rel="stylesheet">
    <style>
        :root { --p: #6366f1; --t1: #1e293b; --t2: #64748b; --b: #e2e8f0; }
        body { font-family: 'Inter', sans-serif; background: #f8fafc; color: var(--t1); margin: 0; padding: 40px 20px; }
        .container { max-width: 1000px; margin: 0 auto; }
        
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
        .header h1 { font-size: 28px; font-weight: 800; margin: 0; background: linear-gradient(to right, var(--t1), var(--t2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .back-link { text-decoration: none; color: var(--t2); font-size: 14px; padding: 8px 16px; border-radius: 8px; border: 1px solid var(--b); background: #fff; transition: 0.2s; }
        .back-link:hover { color: var(--p); border-color: var(--p); background: #eef2ff; }

        .card { background: #fff; border-radius: 12px; border: 1px solid var(--b); box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; text-align: left; min-width: 600px; }
        th { padding: 14px 24px; background: #fcfcfd; font-size: 12px; text-transform: uppercase; color: var(--t2); border-bottom: 1px solid var(--b); letter-spacing: 0.05em; }
        td { padding: 16px 24px; font-size: 14px; border-bottom: 1px solid var(--b); transition: 0.1s; }
        tr:hover td { background: #f1f5f9; }

        .phone { font-weight: 600; font-family: monospace; }
        .msg { color: var(--t2); max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        
        .badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: 600; }
        .badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; }
        .success { background: #f0fdf4; color: #166534; } .success::before { background: #22c55e; }
        .error { background: #fef2f2; color: #991b1b; } .error::before { background: #ef4444; }
        
        .date { color: var(--t2); font-variant-numeric: tabular-nums; }
        .empty { text-align: center; padding: 60px; color: var(--t2); }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>Historique des vérifications</h1>
            <a href="index.php" class="back-link">← Accueil</a>
        </header>

        <div class="card">
            <table>
                <thead>
                    <tr><th>Numéro</th><th>Statut</th><th>Détails</th><th>Date</th></tr>
                </thead>
                <tbody>
                    <?php if (empty($history)): ?>
                        <tr><td colspan="4" class="empty">📂 Aucun historique disponible.</td></tr>
                    <?php else: foreach ($history as $l): $s = $l['status'] === 'success'; ?>
                        <tr>
                            <td class="phone"><?= htmlspecialchars($l['phone_number']) ?></td>
                            <td><span class="badge <?= $s ? 'success' : 'error' ?>"><?= $s ? 'Valide' : 'Échec' ?></span></td>
                            <td class="msg" title="<?= htmlspecialchars($l['message']) ?>"><?= htmlspecialchars($l['message']) ?></td>
                            <td class="date">
                                <b><?= date('d M', strtotime($l['created_at'])) ?></b> 
                                <small style="opacity:0.6"><?= date('H:i', strtotime($l['created_at'])) ?></small>
                            </td>
                        </tr>
                    <?php endforeach; endif; ?>
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>