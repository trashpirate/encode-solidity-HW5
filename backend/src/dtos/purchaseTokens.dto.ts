import { ApiProperty } from "@nestjs/swagger";

export class PurchaseTokensDto {
    @ApiProperty({ type: Number, default: 0.001, required: true})
    amount: number;
}