#define HAS_CALLBACK
#include <stdint.h>
#include "hookapi.h"

uint8_t txn[283] =
{
/* size,upto */
/*   3,  0 */   0x12U, 0x00U, 0x00U,                                                               /* tt = Payment */
/*   5,  3*/    0x22U, 0x80U, 0x00U, 0x00U, 0x00U,                                          /* flags = tfCanonical */
/*   5,  8 */   0x24U, 0x00U, 0x00U, 0x00U, 0x00U,                                                 /* sequence = 0 */
/*   5, 13 */   0x99U, 0x99U, 0x99U, 0x99U, 0x99U,                                                /* dtag, flipped */
/*   6, 18 */   0x20U, 0x1AU, 0x00U, 0x00U, 0x00U, 0x00U,                                      /* first ledger seq */
/*   6, 24 */   0x20U, 0x1BU, 0x00U, 0x00U, 0x00U, 0x00U,                                       /* last ledger seq */
/*  49, 30 */   0x61U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,              /* amount field 9 or 49 bytes */
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U,
                0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99U, 0x99,
/*   9, 79 */   0x68U, 0x40U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U, 0x00U,                         /* fee      */
/*  35, 88 */   0x73U, 0x21U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,       /* pubkey   */
/*  22,123 */   0x81U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                                 /* src acc  */
/*  22,145 */   0x83U, 0x14U, 0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,                                 /* dst acc  */
/* 116,167 */   /* emit details */
/*   0,283 */
};

// ACCOUNTS
#define HOOK_ACC (txn + 125U)
#define OTX_ACC (txn + 147U)

// TXS
#define FLS_OUT (txn + 20U)                                                                                            
#define LLS_OUT (txn + 26U)                                                                                            
#define DTAG_OUT (txn + 14U)                                                                                           
#define AMOUNT_OUT (txn + 30U)                                                                                                                                                                                
#define EMIT_OUT (txn + 167U)                                                                                          
#define FEE_OUT (txn + 80U)



int64_t cbak(uint32_t reserved)
{
    TRACESTR("Loyalty Hook: callback called.");
    return 0;
}

int64_t hook(uint32_t reserved)
{
    TRACESTR("Loyalty Hook: Started");

    etxn_reserve(1);

    // shop owner account ID
    unsigned char hook_accid[20];
    hook_account((uint32_t)hook_accid, 20);
    hook_account(HOOK_ACC, 20);

    // get sender(customer) account ID
    uint8_t sender_accid[20];
    int32_t sender_accid_len = otxn_field(SBUF(sender_accid), sfAccount);
    TRACEVAR(sender_accid_len);
    if (sender_accid_len < 20)
        rollback(SBUF("Loyalty Hook: sender account ID is too short"), 1);

    // get send amount
    unsigned char amount_buffer[48];
    int64_t amount_len = otxn_field(SBUF(amount_buffer), sfAmount);
    
    if (amount_len != 8)
        rollback(SBUF("Loyalty Hook: non-XRP transaction detected"), 1);

    int64_t otxn_drops = AMOUNT_TO_DROPS(amount_buffer);
    TRACEVAR(otxn_drops);
    if (otxn_drops <= 0)
        rollback(SBUF("Loyalty Hook: No XRP was sent transaction detected"), 1);
    
    // Get token ratio from parameters
    uint8_t ratio_buff[48];
    uint8_t ratio_key[5] = { 'R', 'A', 'T', 'I', 'O' };
    int64_t ratio_native = hook_param(SBUF(ratio_buff), SBUF(ratio_key)) == 8;

    int64_t token_ratio = *((int64_t*)ratio_buff);
    TRACEVAR(token_ratio);

    if (float_compare(token_ratio, 0, COMPARE_LESS | COMPARE_EQUAL) == 1)
        rollback(SBUF("Loyalty Hook: Token ratio is zero or less"), 1);
    
    // Get token code from parameters
    uint8_t token_buff[48];
    uint8_t token_key[5] = { 'T', 'O', 'K', 'E', 'N' };
    int64_t token_len = hook_param(SBUF(token_buff), SBUF(token_key));
    TRACEVAR(token_len);
    TRACEVAR(token_buff);

    if (token_len < 1)
        rollback(SBUF("Loyalty Hook: Token code is empty"), 1);

    
    // Calculate tokens to send by multiplying token ratio and XRP amount
    int64_t tokens_to_send = float_multiply(token_ratio, float_divide(otxn_drops, 1000000));

    // TXN PREPARE: FirstLedgerSequence
    uint32_t fls = (uint32_t)ledger_seq() + 1;
    *((uint32_t*)(FLS_OUT)) = FLIP_ENDIAN(fls);

    // TXN PREPARE: LastLedgerSequense
    uint32_t lls = fls + 4 ;
    *((uint32_t*)(LLS_OUT)) = FLIP_ENDIAN(lls);

    // TXN PREPARE: TakerGets
    float_sto(
        AMOUNT_OUT,
        49,
        token_buff,
        20,
        hook_accid,
        20,
        tokens_to_send,
        sfTakerGets
    );

    // TXN PREPARE: Dest Tag <- Source Tag
    if (otxn_field(DTAG_OUT, 4, sfSourceTag) == 4)
        *(DTAG_OUT-1) = 0x2EU;

    // TXN PREPARE: Emit Metadata
    etxn_details(EMIT_OUT, 116U);

    // TXN PREPARE: Fee
    {
        int64_t fee = etxn_fee_base(SBUF(txn));
        uint8_t *b = FEE_OUT;
        *b++ = 0b01000000 + ((fee >> 56) & 0b00111111);
        *b++ = (fee >> 48) & 0xFFU;
        *b++ = (fee >> 40) & 0xFFU;
        *b++ = (fee >> 32) & 0xFFU;
        *b++ = (fee >> 24) & 0xFFU;
        *b++ = (fee >> 16) & 0xFFU;
        *b++ = (fee >> 8) & 0xFFU;
        *b++ = (fee >> 0) & 0xFFU;
    }

    TRACEHEX(txn);  // <- final tx blob
    
    // TXN: Emit/Send Txn
    uint8_t emithash[32];
    int64_t emit_result = emit(SBUF(emithash), SBUF(txn));
    if (emit_result > 0)
    {
        accept(SBUF("txn_payment.c: Tx emitted success."), 0);
    }
    accept(SBUF("txn_payment.c: Tx emitted failure."), 0);
    

    _g(1,1);

    return 0;
}