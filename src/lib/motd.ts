import logger from "./logger";

export class Motd {
    static render() {
        logger.info('');
        logger.info('                      \'dOOd\'');
        logger.info('                    .oOo::dOo.');
        logger.info('                   ;kk,    ,kk;');
        logger.info('                 .l0o.      .o0l.');
        logger.info('         .oKkxdc;d0c          c0d;cdxkKo.');
        logger.info('         ;0o..;oONk.          .kXOo;..o0;');
        logger.info('         d0,    .:xkc.      .ckx:.    ,0d');
        logger.info('clcc:;\'.\'Ok.       :kk,    ,kk:.      .kO\'.\';:cccc');
        logger.info('NkllloddkX0c.       .o0c..c0o.       .c0XkddolclkN');
        logger.info('Ko      .,cdxdc.      c0KK0c      \'cxxdc,.      oK');
        logger.info('xO\'         .,okd;    .xXKl    .;dko,.         \'Ox');
        logger.info(';0d.           .ckx,  ,0x\'.   ;xkc.           .d0;');
        logger.info(' c0l.            .lOo\'o0;   .dOl.            .o0c');
        logger.info('  c0o.             ,kKXk.  ,kk,             .o0c');
        logger.info('   ;kk,             .kWd. ,Ox.             ,kk,');
        logger.info('    .lOd\'            .OOcckk.            ,dOl.');
        logger.info('      .okx:.          ;KNNK;          .:xkl.');
        logger.info('        .:dkdc\'.      .xWWx.      .,cdkd:.')
        logger.info('           .;ldxdolc:;;kNNk;;:clodxdl;.')
        logger.info('               ..;:loooddddoool:;..');
        logger.info('');
        logger.info(`************* LOTUSKIT, version ${process.env.npm_package_version} *************`);
        logger.info("Welcome! We're opening the lotus, please be patient...");
    }
}
