#define HAS_CALLBACK
#include <stdint.h>
#include "hookapi.h"

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
    if (otxn_drops > 0)
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

    if (token_len < 1)
        rollback(SBUF("Loyalty Hook: Token code is empty"), 1);

    
    int64_t tokens_to_send = otxn_drops * token_ratio;

    unsigned char tx[PREPARE_PAYMENT_SIMPLE_SIZE];

    // PREPARE_PAYMENT_SIMPLE(tx, )


    accept(SBUF("Loyalty Hook: Emitted transaction"), 0);
    return 0;
}