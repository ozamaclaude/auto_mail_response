function sendMailFromForm() {
    Logger.log('sendMailFromForm() debug start');

    //------------------------------------------------------------
    // �ݒ�G���A��������
    //------------------------------------------------------------

    // �����A�{���A�t�b�^�[
    var subject = "[���₢���킹]"; 
    var body
        = "���₢���킹���肪�Ƃ��������܂��B\n\n"
        + "------------------------------------------------------------\n";
    var footer
        = "------------------------------------------------------------\n\n"
        + "��قǒS���҂�育�A�������Ă��������܂��B";

    // ���̓J�������̎w��
    var NAME_COL_NAME = '�����O';
    var MAIL_COL_NAME = '���[���A�h���X';
    var SUBJ_COL_NAME = '����';

    // ���[�����M��
    var admin = "sample@googlegroups.com"; // �Ǘ��ҁi�K�{�j
    var cc    = "";    // Cc:
    var bcc   = admin; // Bcc:
    var reply = admin; // Reply-To:
    var to    = "";    // To: �i���͎҂̃A�h���X�������œ���܂��j

    //------------------------------------------------------------
    // �ݒ�G���A�����܂�
    //------------------------------------------------------------

    try{
        // �X�v���b�h�V�[�g�̑���
        var sh   = SpreadsheetApp.getActiveSheet();
        var rows = sh.getLastRow();
        var cols = sh.getLastColumn();
        var rg   = sh.getDataRange();
        Logger.log("rows="+rows+" cols="+cols);

        // ���[�������E�{���쐬�Ƒ��M�惁�[���A�h���X�擾
        for (var j = 1; j <= cols; j++ ) {
            var col_name  = rg.getCell(1, j).getValue();    // �J������
            if (col_name=="") continue;
            var col_value = rg.getCell(rows, j).getValue(); // ���͒l
            body += "�y"+col_name+"�z\n";
            body += col_value + "\n\n";
            if ( col_name === NAME_COL_NAME ) {
                body = col_value+" �l\n\n"+body;
            }
            if ( col_name === MAIL_COL_NAME ) {
                to = col_value;
            }
            if ( col_name === SUBJ_COL_NAME ) {
                subject += col_value;
            }
        }
        body += footer;

        // ���M��I�v�V����
        var options = {};
        if ( cc )    options.cc      = cc;
        if ( bcc )   options.bcc     = bcc;
        if ( reply ) options.replyTo = reply;

        // ���[�����M
        if ( to ) {
            MailApp.sendEmail(to, subject, body, options);
            MailApp.sendEmail(admin, subject, body, options);
        }else{
            MailApp.sendEmail(admin, "�y���s�zGoogle�t�H�[���Ƀ��[���A�h���X���w�肳��Ă��܂���", body);
        }
    }catch(e){
        MailApp.sendEmail(admin, "�y���s�zGoogle�t�H�[�����烁�[�����M���ɃG���[������", e.message);
    } 
}