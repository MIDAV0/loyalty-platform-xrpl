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

    // int equal = 0;
    // BUFFER_EQUAL(equal, hook_accid, sender_accid, 20);
    // if (!equal)
    // {
    //     accept(SBUF("Loyalty Hook: sender is not the shop owner"), 0);
    // }

    // get send amount
    unsigned char amount_buffer[48];
    int64_t amount_len = otxn_field(SBUF(amount_buffer), sfAmount);
    int64_t drops_to_send = 0; // default to 0

    int64_t token_ratio = 1; // 1 token = 1 XRP Get from parameters
    // Get token code from parameters

    // Check zero tx abuse

    if (amount_len != 8)
    {
        TRACESTR("Loyalty Hook: Non-xrp transaction detected");
    } else
    {
        TRACESTR("Loyalty Hook: XRP transaction detected");
        int64_t otxn_drops = AMOUNT_TO_DROPS(amount_buffer);
        TRACEVAR(otxn_drops);
        if (otxn_drops > 0)
            drops_to_send = otxn_drops / token_ratio;
    }

    TRACEVAR(drops_to_send);

    unsigned char tx[PREPARE_PAYMENT_SIMPLE_SIZE];

    // PREPARE_PAYMENT_SIMPLE(tx, )


    accept(SBUF("Loyalty Hook: Emitted transaction"), 0);
    return 0;
}