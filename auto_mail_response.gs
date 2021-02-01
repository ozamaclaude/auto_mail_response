function sendMailFromForm() {
    Logger.log('sendMailFromForm() debug start');

    //------------------------------------------------------------
    // 設定エリアここから
    //------------------------------------------------------------

    // 件名、本文、フッター
    var subject = "[お問い合わせ]"; 
    var body
        = "お問い合わせありがとうございます。\n\n"
        + "------------------------------------------------------------\n";
    var footer
        = "------------------------------------------------------------\n\n"
        + "後ほど担当者よりご連絡させていただきます。";

    // 入力カラム名の指定
    var NAME_COL_NAME = 'お名前';
    var MAIL_COL_NAME = 'メールアドレス';
    var SUBJ_COL_NAME = '件名';

    // メール送信先
    var admin = "sample@googlegroups.com"; // 管理者（必須）
    var cc    = "";    // Cc:
    var bcc   = admin; // Bcc:
    var reply = admin; // Reply-To:
    var to    = "";    // To: （入力者のアドレスが自動で入ります）

    //------------------------------------------------------------
    // 設定エリアここまで
    //------------------------------------------------------------

    try{
        // スプレッドシートの操作
        var sh   = SpreadsheetApp.getActiveSheet();
        var rows = sh.getLastRow();
        var cols = sh.getLastColumn();
        var rg   = sh.getDataRange();
        Logger.log("rows="+rows+" cols="+cols);

        // メール件名・本文作成と送信先メールアドレス取得
        for (var j = 1; j <= cols; j++ ) {
            var col_name  = rg.getCell(1, j).getValue();    // カラム名
            if (col_name=="") continue;
            var col_value = rg.getCell(rows, j).getValue(); // 入力値
            body += "【"+col_name+"】\n";
            body += col_value + "\n\n";
            if ( col_name === NAME_COL_NAME ) {
                body = col_value+" 様\n\n"+body;
            }
            if ( col_name === MAIL_COL_NAME ) {
                to = col_value;
            }
            if ( col_name === SUBJ_COL_NAME ) {
                subject += col_value;
            }
        }
        body += footer;

        // 送信先オプション
        var options = {};
        if ( cc )    options.cc      = cc;
        if ( bcc )   options.bcc     = bcc;
        if ( reply ) options.replyTo = reply;

        // メール送信
        if ( to ) {
            MailApp.sendEmail(to, subject, body, options);
            MailApp.sendEmail(admin, subject, body, options);
        }else{
            MailApp.sendEmail(admin, "【失敗】Googleフォームにメールアドレスが指定されていません", body);
        }
    }catch(e){
        MailApp.sendEmail(admin, "【失敗】Googleフォームからメール送信中にエラーが発生", e.message);
    } 
}