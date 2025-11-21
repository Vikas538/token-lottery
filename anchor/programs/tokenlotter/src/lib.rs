#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("Count3AcZucFDPSFBAeHkQ6AvttieKUkyJ8HiQGhQwe");

#[program]
pub mod tokenlotter {
    use super::*;

    pub fn close(_ctx: Context<CloseTokenlotter>) -> Result<()> {
        Ok(())
    }

    pub fn decrement(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.tokenlotter.count = ctx.accounts.tokenlotter.count.checked_sub(1).unwrap();
        Ok(())
    }

    pub fn increment(ctx: Context<Update>) -> Result<()> {
        ctx.accounts.tokenlotter.count = ctx.accounts.tokenlotter.count.checked_add(1).unwrap();
        Ok(())
    }

    pub fn initialize(_ctx: Context<InitializeTokenlotter>) -> Result<()> {
        Ok(())
    }

    pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
        ctx.accounts.tokenlotter.count = value.clone();
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeTokenlotter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  init,
  space = 8 + Tokenlotter::INIT_SPACE,
  payer = payer
    )]
    pub tokenlotter: Account<'info, Tokenlotter>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseTokenlotter<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    #[account(
  mut,
  close = payer, // close account and return lamports to payer
    )]
    pub tokenlotter: Account<'info, Tokenlotter>,
}

#[derive(Accounts)]
pub struct Update<'info> {
    #[account(mut)]
    pub tokenlotter: Account<'info, Tokenlotter>,
}

#[account]
#[derive(InitSpace)]
pub struct Tokenlotter {
    count: u8,
}
